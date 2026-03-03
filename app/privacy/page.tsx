export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full font-display">
        <div className="hidden md:block glass border-b border-primary/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-6 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <a href="/">
                <img src="/logo.svg" className="w-20 md:w-24 lg:w-28" alt="Logo" />
              </a>
            </div>
            <nav className="flex items-center gap-6 lg:gap-10">
              <a className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/">
                Главная
              </a>
              <a className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/reviews">
                Отзывы
              </a>
              <a className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/contacts">
                Контакты
              </a>
            </nav>
          </div>
        </div>

        <div className="md:hidden p-3 w-full flex justify-center">
          <div className="glass rounded-2xl px-4 py-3 inline-flex items-center justify-center">
            <a href="/">
              <img src="/logo.svg" className="w-24" alt="Logo" />
            </a>
          </div>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-around m-3">
            <a className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/reviews">
              <span className="material-symbols-outlined text-xl">star</span>
              <span>Отзывы</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/">
              <span className="material-symbols-outlined text-xl">home</span>
              <span>Главная</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/contacts">
              <span className="material-symbols-outlined text-xl">account_box</span>
              <span>Контакты</span>
            </a>
          </nav>
        </div>
      </header>

      <div className="font-display bg-background-light text-slate-900 min-h-screen">
        <main className="max-w-4xl mx-auto px-6 max-[480px]:px-4 py-12 max-[480px]:py-8 pb-24 md:pb-12">
          <div className="glass rounded-3xl p-8 max-[480px]:p-6 lg:p-12 shadow-2xl border border-white/40">
            <h1 className="text-4xl max-[480px]:text-3xl font-black tracking-tight text-slate-900 mb-8">
              Политика конфиденциальности и обработки персональных данных
            </h1>

            <div className="space-y-8 text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Общие положения</h2>
                <p className="mb-4">
                  Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей, 
                  использующих сервис онлайн-записи на услуги студии красоты (далее — «Сервис»).
                </p>
                <p>
                  Используя Сервис и предоставляя свои персональные данные, вы подтверждаете свое согласие с условиями настоящей 
                  Политики конфиденциальности и даете согласие на обработку ваших персональных данных в соответствии с условиями, 
                  изложенными ниже.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Определения</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Персональные данные</strong> — любая информация, относящаяся к прямо или косвенно определенному или 
                  определяемому физическому лицу (субъекту персональных данных).</li>
                  <li><strong>Обработка персональных данных</strong> — любое действие (операция) или совокупность действий (операций), 
                  совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными.</li>
                  <li><strong>Оператор</strong> — организация, осуществляющая обработку персональных данных.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Какие данные мы собираем</h2>
                <p className="mb-4">При использовании Сервиса мы можем собирать следующие персональные данные:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Имя и фамилия</li>
                  <li>Номер телефона</li>
                  <li>Дата и время записи на услугу</li>
                  <li>Выбранные услуги</li>
                  <li>Комментарии и дополнительные пожелания</li>
                  <li>Технические данные (IP-адрес, тип браузера, операционная система) для обеспечения работы Сервиса</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Цели обработки персональных данных</h2>
                <p className="mb-4">Мы обрабатываем ваши персональные данные в следующих целях:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Обработка и подтверждение записи на услуги</li>
                  <li>Связь с вами для уточнения деталей записи</li>
                  <li>Отправка уведомлений и напоминаний о предстоящих визитах</li>
                  <li>Улучшение качества предоставляемых услуг</li>
                  <li>Выполнение обязательств перед вами</li>
                  <li>Соблюдение требований законодательства</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Правовые основания обработки</h2>
                <p className="mb-4">Обработка персональных данных осуществляется на основании:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Вашего согласия на обработку персональных данных</li>
                  <li>Необходимости исполнения договора, стороной которого вы являетесь</li>
                  <li>Требований законодательства Российской Федерации</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Способы и сроки обработки</h2>
                <p className="mb-4">
                  Обработка персональных данных осуществляется с использованием средств автоматизации и без использования таких средств. 
                  Мы применяем организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, 
                  уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий.
                </p>
                <p>
                  Персональные данные хранятся в течение срока, необходимого для достижения целей их обработки, но не менее срока, 
                  установленного законодательством Российской Федерации.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Передача данных третьим лицам</h2>
                <p className="mb-4">
                  Мы не передаем ваши персональные данные третьим лицам, за исключением случаев, когда это необходимо для:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Исполнения договора с вами (например, передача данных мастеру для оказания услуги)</li>
                  <li>Соблюдения требований законодательства</li>
                  <li>Защиты прав и законных интересов Оператора</li>
                </ul>
                <p className="mt-4">
                  Мы не продаем и не передаем ваши персональные данные третьим лицам в маркетинговых целях без вашего явного согласия.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Ваши права</h2>
                <p className="mb-4">В соответствии с законодательством о персональных данных вы имеете право:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Получать информацию о наличии и содержании ваших персональных данных</li>
                  <li>Требовать уточнения, обновления или удаления ваших персональных данных</li>
                  <li>Отозвать согласие на обработку персональных данных</li>
                  <li>Обжаловать действия или бездействие Оператора в уполномоченный орган по защите прав субъектов персональных данных</li>
                </ul>
                <p className="mt-4">
                  Для реализации ваших прав вы можете направить письменный запрос на контактные данные, указанные в разделе «Контакты».
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Использование cookies</h2>
                <p>
                  Сервис может использовать файлы cookies для улучшения работы сайта и повышения удобства пользователей. 
                  Вы можете настроить свой браузер для отказа от cookies, однако это может ограничить функциональность Сервиса.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Безопасность данных</h2>
                <p>
                  Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, 
                  раскрытия или уничтожения. Доступ к персональным данным имеют только уполномоченные сотрудники, которые обязаны 
                  соблюдать конфиденциальность.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Изменения в Политике конфиденциальности</h2>
                <p>
                  Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. Актуальная версия всегда 
                  доступна на данной странице. Продолжая использовать Сервис после внесения изменений, вы соглашаетесь с обновленной 
                  Политикой конфиденциальности.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Контакты</h2>
                <p className="mb-4">
                  Если у вас возникли вопросы относительно обработки ваших персональных данных или вы хотите реализовать свои права, 
                  вы можете связаться с нами:
                </p>
                <ul className="list-none space-y-2">
                  <li>По телефону, указанному на странице <a href="/contacts" className="text-primary hover:underline">Контакты</a></li>
                  <li>Через форму обратной связи на сайте</li>
                </ul>
              </section>

              <section className="pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Дата последнего обновления: {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
