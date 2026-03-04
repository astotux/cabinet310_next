# SEO Оптимизация — Кабинет 310

## ✅ Что уже сделано

### 1. Метаданные и структура
- ✅ Добавлены расширенные метатеги (title, description, keywords)
- ✅ Open Graph метатеги для соцсетей
- ✅ Twitter Card метатеги
- ✅ Canonical URL
- ✅ Robots meta tags
- ✅ Метаданные для всех страниц (главная, бронирование, отзывы, контакты, политика)

### 2. Структурированные данные (JSON-LD)
- ✅ Schema.org разметка BeautySalon
- ✅ Адрес и геолокация (Сыктывкар)
- ✅ Часы работы
- ✅ Каталог услуг (OfferCatalog)
- ✅ Рейтинг и отзывы (AggregateRating)

### 3. Техническое SEO
- ✅ robots.txt создан
- ✅ sitemap.xml (динамический)
- ✅ PWA manifest
- ✅ Языковая локализация (lang="ru")

### 4. Контент оптимизация
- ✅ Ключевые слова для Сыктывкара
- ✅ Локальные запросы в описаниях
- ✅ Семантические H1-H6 заголовки
- ✅ Alt-теги для изображений

## 📋 Что нужно сделать вручную

### 1. Обновить контактные данные
В файле `app/layout.tsx` замените:
- `telephone: "+7-XXX-XXX-XX-XX"` — реальный телефон
- `streetAddress: "Ваш адрес"` — точный адрес студии
- Координаты `latitude` и `longitude` — точные координаты на карте

### 2. Создать изображение для соцсетей
Создайте файл `/public/og-image.jpg`:
- Размер: 1200x630 пикселей
- Формат: JPG или PNG
- Содержание: логотип + название + услуги

### 3. Подключить Google Analytics и Яндекс.Метрику
Добавьте в `app/layout.tsx` перед закрывающим `</head>`:

```tsx
{/* Google Analytics */}
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script dangerouslySetInnerHTML={{
  __html: \`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  \`
}} />

{/* Яндекс.Метрика */}
<script dangerouslySetInnerHTML={{
  __html: \`
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(XXXXXXXX, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true
    });
  \`
}} />
```

### 4. Верификация в поисковых системах
В `app/layout.tsx` замените коды верификации:
```tsx
verification: {
  google: 'your-google-verification-code',  // Получить в Google Search Console
  yandex: 'your-yandex-verification-code',  // Получить в Яндекс.Вебмастер
},
```

### 5. Обновить sitemap после изменений
Sitemap генерируется автоматически, но проверьте актуальность URL в `app/sitemap.ts`

### 6. Настроить next.config.ts
Убедитесь, что включены оптимизации:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
};
```

## 🚀 Рекомендации для продвижения

### Локальное SEO
1. Зарегистрируйтесь в:
   - Google Мой Бизнес
   - Яндекс.Справочник
   - 2ГИС
   - Zoon.ru
   - Flamp.ru

2. Добавьте отзывы клиентов на внешних площадках

3. Создайте профили в соцсетях:
   - ВКонтакте (уже есть)
   - Instagram
   - Telegram-канал

### Контент-маркетинг
1. Добавьте блог с полезными статьями:
   - "Как подготовиться к перманентному макияжу"
   - "Уход за бровями после татуажа"
   - "Тренды маникюра 2026"

2. Создайте страницы для каждой услуги отдельно:
   - `/services/permanent-brows`
   - `/services/permanent-lips`
   - `/services/eyelash-lamination`
   - `/services/manicure`

### Технические улучшения
1. Оптимизируйте изображения (используйте WebP/AVIF)
2. Настройте кэширование
3. Включите HTTP/2
4. Добавьте AMP-версии страниц (опционально)

### Мониторинг
Отслеживайте:
- Позиции в поиске (Serpstat, Ahrefs)
- Трафик (Google Analytics, Яндекс.Метрика)
- Конверсии (записи через сайт)
- Скорость загрузки (PageSpeed Insights)

## 📊 Целевые запросы для продвижения

### Высокочастотные
- перманентный макияж сыктывкар
- маникюр сыктывкар
- студия красоты сыктывкар

### Среднечастотные
- пудровые брови сыктывкар
- татуаж губ сыктывкар
- ламинирование ресниц сыктывкар
- межресничка сыктывкар

### Низкочастотные (длинный хвост)
- где сделать перманент бровей в сыктывкаре
- лучший мастер перманентного макияжа сыктывкар
- акварельные губы сыктывкар цена
- студия красоты кабинет 310

## 🔗 Полезные ссылки
- [Google Search Console](https://search.google.com/search-console)
- [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org](https://schema.org/)
