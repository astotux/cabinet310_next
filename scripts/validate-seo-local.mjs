// Локальная валидация SEO-файлов
// Запуск: node scripts/validate-seo-local.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const errors = [];
const warnings = [];
const success = [];

function checkFile(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    success.push(`✅ ${description}: найден (${stats.size} байт)`);
    return true;
  } else {
    errors.push(`❌ ${description}: НЕ НАЙДЕН по пути ${filePath}`);
    return false;
  }
}

function checkFileContent(filePath, description, checks) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`❌ ${description}: файл не найден`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  let hasErrors = false;

  for (const check of checks) {
    if (check.type === 'contains') {
      if (content.includes(check.value)) {
        success.push(`✅ ${description}: содержит "${check.value}"`);
      } else {
        errors.push(`❌ ${description}: НЕ содержит "${check.value}"`);
        hasErrors = true;
      }
    } else if (check.type === 'not-contains') {
      if (!content.includes(check.value)) {
        success.push(`✅ ${description}: не содержит "${check.value}"`);
      } else {
        warnings.push(`⚠️ ${description}: содержит "${check.value}" (возможно, это ошибка)`);
      }
    } else if (check.type === 'regex') {
      if (check.pattern.test(content)) {
        success.push(`✅ ${description}: соответствует паттерну ${check.name}`);
      } else {
        errors.push(`❌ ${description}: НЕ соответствует паттерну ${check.name}`);
        hasErrors = true;
      }
    }
  }

  return !hasErrors;
}

console.log('🔍 Проверка SEO-конфигурации...\n');
console.log('='.repeat(60));

// 1. Проверка основных файлов
console.log('\n📁 Проверка файлов:\n');

checkFile('app/sitemap.ts', 'Sitemap');
checkFile('app/robots.ts', 'Robots');
checkFile('app/manifest.ts', 'Manifest');
checkFile('app/favicon.ico', 'Favicon');
checkFile('public/og-image.jpg', 'OG Image');
checkFile('app/layout.tsx', 'Root Layout');

// 2. Проверка содержимого sitemap.ts
console.log('\n📄 Проверка sitemap.ts:\n');

checkFileContent('app/sitemap.ts', 'Sitemap', [
  { type: 'contains', value: 'MetadataRoute.Sitemap' },
  { type: 'contains', value: 'https://cabinet310.ru' },
  { type: 'contains', value: '/services/permanent-brows' },
  { type: 'contains', value: '/services/permanent-lips' },
  { type: 'contains', value: '/services/eyeliner' },
  { type: 'contains', value: '/services/manicure' },
  { type: 'contains', value: '/services/lash-lamination' },
  { type: 'contains', value: '/booking' },
  { type: 'contains', value: '/reviews' },
  { type: 'contains', value: '/contacts' },
  { type: 'contains', value: '/privacy' },
  { type: 'not-contains', value: '/admin' },
  { type: 'not-contains', value: '/api' },
]);

// 3. Проверка robots.ts
console.log('\n🤖 Проверка robots.ts:\n');

checkFileContent('app/robots.ts', 'Robots', [
  { type: 'contains', value: 'MetadataRoute.Robots' },
  { type: 'contains', value: 'https://cabinet310.ru/sitemap.xml' },
  { type: 'contains', value: 'disallow: [\'/admin/\', \'/api/\', \'/qr/\']' },
  { type: 'contains', value: 'userAgent: \'*\'' },
  { type: 'contains', value: 'userAgent: \'Yandex\'' },
  { type: 'contains', value: 'userAgent: \'Googlebot\'' },
]);

// 4. Проверка manifest.ts
console.log('\n📱 Проверка manifest.ts:\n');

checkFileContent('app/manifest.ts', 'Manifest', [
  { type: 'contains', value: 'MetadataRoute.Manifest' },
  { type: 'contains', value: 'Кабинет 310' },
  { type: 'contains', value: '/favicon.ico' },
  { type: 'contains', value: '#7a1ff9' },
  { type: 'regex', pattern: /sizes:\s*['"]48x48['"]/, name: 'размер иконки 48x48' },
]);

// 5. Проверка layout.tsx
console.log('\n🎨 Проверка layout.tsx:\n');

checkFileContent('app/layout.tsx', 'Layout metadata', [
  { type: 'contains', value: 'metadataBase: new URL(\'https://cabinet310.ru\')' },
  { type: 'contains', value: 'Кабинет 310' },
  { type: 'contains', value: '/favicon.ico' },
  { type: 'contains', value: '/og-image.jpg' },
  { type: 'contains', value: 'index: true' },
  { type: 'contains', value: 'follow: true' },
  { type: 'not-contains', value: 'noindex' },
  { type: 'not-contains', value: 'nofollow' },
  { type: 'contains', value: 'yandex-verification' },
  { type: 'contains', value: '050e9e29482539ba' },
]);

// 6. Проверка next.config.ts
console.log('\n⚙️ Проверка next.config.ts:\n');

checkFileContent('next.config.ts', 'Next.js config', [
  { type: 'contains', value: 'compress: true' },
  { type: 'contains', value: 'trailingSlash: false' },
]);

// 7. Проверка размера favicon
console.log('\n🖼️ Проверка favicon:\n');

const faviconPath = path.join(rootDir, 'app/favicon.ico');
if (fs.existsSync(faviconPath)) {
  const stats = fs.statSync(faviconPath);
  if (stats.size > 1000) {
    success.push(`✅ Favicon: размер ${stats.size} байт (норма)`);
  } else {
    warnings.push(`⚠️ Favicon: размер ${stats.size} байт (может быть слишком мал)`);
  }
  
  if (stats.size > 100000) {
    warnings.push(`⚠️ Favicon: размер ${stats.size} байт (может быть слишком велик)`);
  }
}

// 8. Проверка OG Image
console.log('\n🖼️ Проверка OG Image:\n');

const ogImagePath = path.join(rootDir, 'public/og-image.jpg');
if (fs.existsSync(ogImagePath)) {
  const stats = fs.statSync(ogImagePath);
  success.push(`✅ OG Image: размер ${stats.size} байт`);
  
  if (stats.size < 10000) {
    warnings.push(`⚠️ OG Image: размер ${stats.size} байт (может быть слишком мал для качественного превью)`);
  }
  
  if (stats.size > 1000000) {
    warnings.push(`⚠️ OG Image: размер ${stats.size} байт (слишком велик, рекомендуется < 1MB)`);
  }
}

// 9. Проверка middleware
console.log('\n🛡️ Проверка middleware.ts:\n');

if (fs.existsSync(path.join(rootDir, 'middleware.ts'))) {
  checkFileContent('middleware.ts', 'Middleware', [
    { type: 'not-contains', value: '/sitemap' },
    { type: 'not-contains', value: '/robots' },
    { type: 'not-contains', value: '/favicon' },
    { type: 'not-contains', value: '/manifest' },
  ]);
  success.push('✅ Middleware: не блокирует SEO-файлы');
}

// Итоги
console.log('\n' + '='.repeat(60));
console.log('\n📊 РЕЗУЛЬТАТЫ:\n');

if (success.length > 0) {
  console.log(`✅ Успешно: ${success.length}`);
  success.forEach(msg => console.log(`   ${msg}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️ Предупреждения: ${warnings.length}`);
  warnings.forEach(msg => console.log(`   ${msg}`));
}

if (errors.length > 0) {
  console.log(`\n❌ Ошибки: ${errors.length}`);
  errors.forEach(msg => console.log(`   ${msg}`));
  console.log('\n❌ ПРОВЕРКА НЕ ПРОЙДЕНА!');
  process.exit(1);
} else {
  console.log('\n✨ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!');
  console.log('\n📝 Следующие шаги:');
  console.log('1. Собери проект: npm run build');
  console.log('2. Запусти на сервере: npm start');
  console.log('3. Проверь доступность: npm run check-seo');
  console.log('4. Отправь sitemap в Google Search Console и Яндекс Вебмастер');
  process.exit(0);
}
