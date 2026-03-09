// Скрипт для проверки доступности SEO-файлов
// Запуск: node scripts/check-seo-files.js

const https = require('https');

const baseUrl = 'https://cabinet310.ru';
const filesToCheck = [
  '/sitemap.xml',
  '/robots.txt',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/', // главная страница
];

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      const status = res.statusCode;
      const contentType = res.headers['content-type'];
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status,
          contentType,
          size: data.length,
          ok: status === 200
        });
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 0,
        error: err.message,
        ok: false
      });
    });
  });
}

async function main() {
  console.log('🔍 Проверка SEO-файлов для', baseUrl);
  console.log('='.repeat(60));
  
  for (const file of filesToCheck) {
    const result = await checkUrl(baseUrl + file);
    
    const icon = result.ok ? '✅' : '❌';
    console.log(`\n${icon} ${file}`);
    console.log(`   Статус: ${result.status}`);
    
    if (result.contentType) {
      console.log(`   Content-Type: ${result.contentType}`);
    }
    
    if (result.size) {
      console.log(`   Размер: ${result.size} байт`);
    }
    
    if (result.error) {
      console.log(`   Ошибка: ${result.error}`);
    }
    
    // Дополнительные проверки
    if (file === '/sitemap.xml' && result.ok) {
      const hasSitemap = result.size > 100;
      console.log(`   ${hasSitemap ? '✅' : '⚠️'} Sitemap содержит данные`);
    }
    
    if (file === '/robots.txt' && result.ok) {
      const hasRobots = result.size > 50;
      console.log(`   ${hasRobots ? '✅' : '⚠️'} Robots.txt содержит правила`);
    }
    
    if (file === '/favicon.ico' && result.ok) {
      const hasIcon = result.size > 1000;
      console.log(`   ${hasIcon ? '✅' : '⚠️'} Favicon имеет нормальный размер`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Проверка завершена!');
  console.log('\n📝 Следующие шаги:');
  console.log('1. Если все файлы доступны (✅), отправь sitemap в:');
  console.log('   - Google Search Console: https://search.google.com/search-console');
  console.log('   - Яндекс Вебмастер: https://webmaster.yandex.ru');
  console.log('2. Подожди 1-2 недели для индексации');
  console.log('3. Проверь индексацию: site:cabinet310.ru в поиске');
}

main().catch(console.error);
