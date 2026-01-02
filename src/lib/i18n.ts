/**
 * Простая утилита для интернационализации MojService
 * Поддерживает 3 языка: RU, EN, CZ
 */

export type Locale = 'ru' | 'en' | 'cz';

export const DEFAULT_LOCALE: Locale = 'ru';

export const SUPPORTED_LOCALES: Locale[] = ['ru', 'en', 'cz'];

/**
 * Переводы для UI элементов
 */
export const translations = {
  ru: {
    // ServicePriceTable
    servicePriceTableTitle: 'Прайс-лист услуг по ремонту',
    service: 'Услуга',
    price: 'Цена',
    warranty: 'Гарантия',
    months: 'мес.',
    discountNotice: '* При наличии нескольких акций применяется максимальная скидка. Скидки не суммируются.',

    // Breadcrumbs
    home: 'Главная',
    pricelist: 'Прайс-лист',
    repair: 'Ремонт',

    // Category names
    iphone: 'iPhone',
    ipad: 'iPad',
    macbook: 'MacBook',
    appleWatch: 'Apple Watch',

    // Empty states
    pricesSoonTitle: 'Цены скоро будут добавлены',
    pricesSoonDescription: 'Мы работаем над обновлением прайс-листа для {model}. Пожалуйста, свяжитесь с нами для уточнения стоимости ремонта.',
    call: 'Позвонить',
    writeToTelegram: 'Написать в Telegram',
    servicesUnavailableTitle: 'Услуги для этой модели временно недоступны',
    servicesUnavailableDescription: 'Пожалуйста, свяжитесь с нами для получения информации',
    imageSoon: 'Изображение скоро появится',

    // Info blocks
    repairLiveTitle: 'Ремонт LIVE',
    repairLiveDescription: 'Смотрите процесс ремонта в реальном времени',
    bookLiveStream: 'Запись на просмотр',
    liveStreamFormTitle: 'Доступ к трансляции',
    liveStreamFormDescription: 'Введите данные для доступа к онлайн-трансляции ремонта',
    loginPlaceholder: 'Логин',
    passwordPlaceholder: 'Пароль',
    submitAccess: 'Получить доступ',
    cancel: 'Отмена',
    repairOnSiteTitle: 'Ремонт на месте',
    repairOnSiteDescription: 'Пока вы ждете - мы ремонтируем',
    warrantyTitle: '2 года гарантии',
    warrantyDescription: 'Уверенность в качестве наших услуг',

    // Contact block
    readyToRepair: 'Готовы начать ремонт? Свяжитесь с нами прямо сейчас',
    telegram: 'Telegram',

    // ServiceRow
    free: 'БЕСПЛАТНО',
    onRequest: 'По запросу',
    from: 'от',
    clarify: 'Уточняйте',
    minutes: 'мин',
    hours: 'ч',

    // Header
    pricelistMenu: 'Прайс-лист',
    aboutMenu: 'О нас',
    contactsMenu: 'Контакты',
    languageLabel: 'Язык / Language',

    // HeroSection
    repairIphone: 'Ремонт iPhone',
    repairMacbook: 'Ремонт MacBook',
    repairIpad: 'Ремонт iPad',
    repairAppleWatch: 'Ремонт Apple Watch',

    // CommonIssues
    commonIssuesTitle: 'Устраняем частые поломки',
    notTurningOn: 'Не включается',
    liquidDamage: 'Попадание жидкости',
    brokenGlass: 'Разбито стекло',
    noNetwork: 'Не ловит сеть',
    notCharging: 'Не заряжается',
    speakerNotWorking: 'Не работает динамик',

    // ArticlesSection
    articlesTitle: 'Статьи',
    articlesDescription: 'Полезные советы и рекомендации по уходу за вашим смартфоном',
    viewAllArticles: 'Смотреть все статьи',

    // ServiceSection
    serviceSectionTitle: 'Мы не скрываем процесс — доверие рождается в прозрачности',
    serviceSectionDescription: 'Профессиональный и быстрый сервис для устройств.',
    feature1: 'Хотите видеть, как проходит ремонт вашего телефона? Мы предоставляем такую возможность онлайн',
    feature2: 'Профессиональная диагностика',
    feature3: 'Быстрый ремонт',
    feature4: '2 года гарантии',
    feature5: 'Скидки на множественный ремонт',
    bulkDiscountText: '',

    // AboutSection
    aboutTitle: 'HackLab – Ваш надежный сервисный центр Apple в Праге',
    aboutIntro1: 'HackLab — это современный и надежный сервисный центр Apple в Праге, которому доверяют владельцы техники Apple и других брендов. Даже самые прочные устройства со временем требуют внимания — ведь случайное падение, удар, попадание влаги или просто износ комплектующих могут привести к сбоям и поломкам.',
    aboutIntro2: 'Наши специалисты ежедневно восстанавливают десятки iPhone, iPad, MacBook, Apple Watch и другой техники, возвращая её к идеальной работе. Мы понимаем, насколько важна ваша техника, поэтому делаем всё, чтобы ремонт занял минимум времени и принес максимум результата.',
    whyChooseTitle: 'Почему выбирают HackLab',
    whyChooseIntro: 'Сегодня в Праге можно найти множество сервисов, предлагающих ремонт Apple. Но если вы цените качество, прозрачность и профессионализм — HackLab станет вашим надежным партнером. Мы предлагаем:',
    whyFeature1: 'оригинальные запчасти и проверенные комплектующие',
    whyFeature2: 'точную диагностику и грамотный подход к каждому устройству',
    whyFeature3: 'квалифицированных мастеров с опытом работы более 5 лет',
    whyFeature4: 'удобные адреса сервисных центров в разных районах Праги',
    whyFeature5: 'гарантию на все виды работ и деталей',
    whyChooseOutro: 'Наши мастерские оснащены современным оборудованием, что позволяет выполнять даже компонентный ремонт — замену микросхем, восстановление материнских плат, пайку контактов и многое другое.',
    whatWeRepairTitle: 'Что мы ремонтируем',
    whatWeRepairIntro: 'В HackLab вы можете получить профессиональный ремонт любой сложности:',
    repairService1: 'замена экрана или стекла',
    repairService2: 'восстановление после попадания воды',
    repairService3: 'устранение последствий падений и ударов',
    repairService4: 'замена аккумулятора',
    repairService5: 'ремонт разъёмов и кнопок',
    repairService6: 'перепрошивка и обновление системы',
    repairService7: 'восстановление данных и разблокировка устройств',
    whatWeRepairOutro: 'Если ваш iPhone зависает, самопроизвольно выключается, не заряжается или не реагирует на касания — просто принесите его к нам. Мы проведем диагностику и предложим оптимальное решение по времени и стоимости.',
    diagnosticsTitle: 'Профессиональная диагностика и обслуживание',
    diagnosticsText1: 'Каждое устройство проходит детальную диагностику перед началом ремонта. Это позволяет точно определить причину неисправности и подобрать правильный способ восстановления.',
    diagnosticsText2: 'После завершения всех работ мы проводим тестирование, чтобы убедиться, что гаджет работает как новый.',
    diagnosticsText3: 'HackLab — это сервис, где ценят качество, честность и комфорт клиента. Мы не просто ремонтируем технику — мы восстанавливаем ваше удобство, продуктивность и настроение.',
    courierTitle: 'Курьерская доставка и дистанционный сервис',
    courierText: 'Если у вас нет времени приехать лично — не проблема. Мы предлагаем курьерскую доставку по всей Чехии: просто оставьте заявку на сайте, и мы организуем забор устройства из вашего дома или офиса. После ремонта ваш гаджет будет оперативно доставлен обратно в исправном состоянии.',
    weFixTitle: 'We don\'t hack, we fix!',
    weFixText1: 'С каждым месяцем всё больше клиентов выбирают HackLab за качество, скорость и внимательное отношение к деталям. Мы постоянно расширяем сеть сервисных центров в Праге, чтобы быть ещё ближе к вам и вашей технике.',
    weFixText2: 'HackLab — это команда профессионалов, для которых ремонт Apple и другой электроники — не просто работа, а настоящее призвание.',
    weFixText3: 'Доверьте свой гаджет экспертам, и он снова будет работать так же безупречно, как в первый день.',

    // Articles page
    articlesPageTitle: 'Статьи о ремонте телефонов',
    articlesPageDescription: 'Полезные советы по уходу за смартфонами, решению распространенных проблем и профилактике поломок',
    backToHome: 'На главную',

    // Kontakt page
    kontaktPageTitle: 'Контакты',
    kontaktPageDescription: 'Мы находимся в центре Праги. Приезжайте к нам или свяжитесь удобным способом.',

    // ContactSection
    addressTitle: 'Адрес',
    transportTitle: 'Транспорт',
    transportStop: 'Остановка: Lipanská',
    transportTrams: 'Трамваи: 5, 9, 15, 26',
    openingHoursTitle: 'Часы работы',
    weekdaysHours: 'Понедельник - Пятница: 9:00 - 19:00',
    saturdayHours: 'Суббота: 10:30 - 17:30',

    // Pricelist page
    pricelistTitle: 'Ремонт Apple устройств в Праге',
    pricelistContentTitle: 'Ремонт Apple в Праге',
    pricelistCategoryQuestion: 'Какое устройство нужно отремонтировать? Зная модель вашего устройства, мы точнее определим стоимость и сроки ремонта.',
    pricelistIntro: 'Ваш iPhone, iPad или MacBook перестал включаться, разбился, утонул или просто стал работать нестабильно? Добро пожаловать в сервисный центр HackLab.',
    pricelistWhyUs: 'Почему именно мы?',
    pricelistWhyUsText1: 'Мы выполняем быстрый и профессиональный ремонт всей техники Apple любой сложности. Наши специалисты устранят любые неисправности, точно определят причины поломки и вернут вашему устройству идеальную работу. HackLab известен в Праге своей скоростью и качеством обслуживания — срочная замена дисплея, аккумулятора, кнопок или шлейфов занимает от 30 минут.',
    pricelistWhyUsText2: 'Мы работаем с техникой Apple уже более 10 лет и накопили огромный опыт в восстановлении iPhone, iPad и MacBook. Сотрудничаем только с проверенными поставщиками оригинальных запчастей, что гарантирует надежность и долговечность ремонта.',
    pricelistWhyUsText3: 'Мы ценим ваше время и понимаем, насколько сложно оставаться без связи. Поэтому, если вы не можете лично привезти устройство в наш сервис, закажите курьера HackLab — мы заберём гаджет, отремонтируем его и вернём обратно в кратчайшие сроки.',
    pricelistFooter: 'HackLab — быстро, качественно и с заботой о вашем устройстве.',

    // DeviceModelGrid
    selectModelForPriceList: 'Выберите модель для просмотра прайс-листа',
    modelsNotFound: 'Модели не найдены',
    categoriesUnavailable: 'Категории временно недоступны',
    tryRefresh: 'Попробуйте обновить страницу',

    // Footer
    footerAbout: 'HackLab предоставляет эксклюзивный сервис и ремонт продуктов; а именно iPhone, iPad, MacBook и Apple Watch.',
    footerLinksTitle: 'Также посетите',
    footerArticles: 'Статьи',
    footerPricelist: 'Прайс-лист',
    footerContacts: 'Контакты',
    footerHoursTitle: 'Часы работы',
    footerMonday: 'Понедельник: 09:00 - 19:00',
    footerTuesday: 'Вторник: 09:00 - 19:00',
    footerWednesday: 'Среда: 09:00 - 19:00',
    footerThursday: 'Четверг: 09:00 - 19:00',
    footerFriday: 'Пятница: 09:00 - 19:00',
    footerSaturday: 'Суббота: 10:30 - 17:30',
    footerSunday: 'Воскресенье: закрыто',
    footerContactTitle: 'Свяжитесь с нами:',
    footerCopyright: 'Copyright © 2025',
  },
  en: {
    // ServicePriceTable
    servicePriceTableTitle: 'Repair Services Price List',
    service: 'Service',
    price: 'Price',
    warranty: 'Warranty',
    months: 'mo.',
    discountNotice: '* If multiple promotions apply, the maximum discount is applied. Discounts do not stack.',

    // Breadcrumbs
    home: 'Home',
    pricelist: 'Price List',
    repair: 'Repair',

    // Category names
    iphone: 'iPhone',
    ipad: 'iPad',
    macbook: 'MacBook',
    appleWatch: 'Apple Watch',

    // Empty states
    pricesSoonTitle: 'Prices will be added soon',
    pricesSoonDescription: 'We are working on updating the price list for {model}. Please contact us to clarify the repair cost.',
    call: 'Call',
    writeToTelegram: 'Write to Telegram',
    servicesUnavailableTitle: 'Services for this model are temporarily unavailable',
    servicesUnavailableDescription: 'Please contact us for information',
    imageSoon: 'Image coming soon',

    // Info blocks
    repairLiveTitle: 'LIVE Repair',
    repairLiveDescription: 'Watch the repair process in real time',
    bookLiveStream: 'Book Viewing',
    liveStreamFormTitle: 'Stream Access',
    liveStreamFormDescription: 'Enter credentials to access the live repair stream',
    loginPlaceholder: 'Login',
    passwordPlaceholder: 'Password',
    submitAccess: 'Get Access',
    cancel: 'Cancel',
    repairOnSiteTitle: 'On-site repair',
    repairOnSiteDescription: 'While you wait - we repair',
    warrantyTitle: '2 years warranty',
    warrantyDescription: 'Confidence in the quality of our services',

    // Contact block
    readyToRepair: 'Ready to start the repair? Contact us right now',
    telegram: 'Telegram',

    // ServiceRow
    free: 'FREE',
    onRequest: 'On request',
    from: 'from',
    clarify: 'Contact us',
    minutes: 'min',
    hours: 'h',

    // Header
    pricelistMenu: 'Price List',
    aboutMenu: 'About Us',
    contactsMenu: 'Contacts',
    languageLabel: 'Language',

    // HeroSection
    repairIphone: 'iPhone Repair',
    repairMacbook: 'MacBook Repair',
    repairIpad: 'iPad Repair',
    repairAppleWatch: 'Apple Watch Repair',

    // CommonIssues
    commonIssuesTitle: 'We Fix Common Problems',
    notTurningOn: 'Not turning on',
    liquidDamage: 'Liquid damage',
    brokenGlass: 'Broken glass',
    noNetwork: 'No network',
    notCharging: 'Not charging',
    speakerNotWorking: 'Speaker not working',

    // ArticlesSection
    articlesTitle: 'Articles',
    articlesDescription: 'Useful tips and recommendations for your smartphone care',
    viewAllArticles: 'View all articles',

    // ServiceSection
    serviceSectionTitle: 'We don\'t hide the process — trust is born in transparency',
    serviceSectionDescription: 'Professional and fast device service.',
    feature1: 'Want to see how your phone is being repaired? We provide this opportunity online',
    feature2: 'Professional diagnostics',
    feature3: 'Fast repair',
    feature4: '2 years warranty',
    feature5: 'Discounts on multiple repairs',
    bulkDiscountText: '',

    // AboutSection
    aboutTitle: 'HackLab – Your Reliable Apple Service Center in Prague',
    aboutIntro1: 'HackLab is a modern and reliable Apple service center in Prague, trusted by owners of Apple and other brands. Even the most durable devices eventually require attention — accidental drops, impacts, liquid damage, or simply wear and tear of components can lead to malfunctions and breakdowns.',
    aboutIntro2: 'Our specialists restore dozens of iPhones, iPads, MacBooks, Apple Watches and other devices daily, bringing them back to perfect working condition. We understand how important your devices are, so we do everything to ensure repairs take minimal time and deliver maximum results.',
    whyChooseTitle: 'Why Choose HackLab',
    whyChooseIntro: 'Today in Prague you can find many services offering Apple repair. But if you value quality, transparency and professionalism — HackLab will become your reliable partner. We offer:',
    whyFeature1: 'original parts and tested components',
    whyFeature2: 'accurate diagnostics and professional approach to each device',
    whyFeature3: 'qualified technicians with over 5 years of experience',
    whyFeature4: 'convenient service center locations in different districts of Prague',
    whyFeature5: 'warranty on all types of work and parts',
    whyChooseOutro: 'Our workshops are equipped with modern equipment, allowing us to perform even component-level repairs — chip replacement, motherboard restoration, contact soldering and much more.',
    whatWeRepairTitle: 'What We Repair',
    whatWeRepairIntro: 'At HackLab you can get professional repair of any complexity:',
    repairService1: 'screen or glass replacement',
    repairService2: 'water damage restoration',
    repairService3: 'fixing drop and impact damage',
    repairService4: 'battery replacement',
    repairService5: 'connector and button repair',
    repairService6: 'firmware update and system upgrade',
    repairService7: 'data recovery and device unlocking',
    whatWeRepairOutro: 'If your iPhone freezes, shuts down spontaneously, won\'t charge or doesn\'t respond to touch — just bring it to us. We will diagnose it and offer the optimal solution for time and cost.',
    diagnosticsTitle: 'Professional Diagnostics and Service',
    diagnosticsText1: 'Each device undergoes detailed diagnostics before repair begins. This allows us to accurately determine the cause of the malfunction and select the right restoration method.',
    diagnosticsText2: 'After all work is completed, we perform testing to ensure the device works like new.',
    diagnosticsText3: 'HackLab is a service that values quality, honesty and customer comfort. We don\'t just repair devices — we restore your convenience, productivity and peace of mind.',
    courierTitle: 'Courier Delivery and Remote Service',
    courierText: 'If you don\'t have time to come in person — no problem. We offer courier delivery throughout the Czech Republic: just leave a request on the website, and we will organize pickup from your home or office. After repair, your device will be promptly delivered back in working condition.',
    weFixTitle: 'We don\'t hack, we fix!',
    weFixText1: 'Every month more and more customers choose HackLab for quality, speed and attention to detail. We are constantly expanding our network of service centers in Prague to be even closer to you and your devices.',
    weFixText2: 'HackLab is a team of professionals for whom repairing Apple and other electronics is not just work, but a true calling.',
    weFixText3: 'Trust your device to the experts, and it will work flawlessly again, just like the first day.',

    // Articles page
    articlesPageTitle: 'Phone Repair Articles',
    articlesPageDescription: 'Useful tips for smartphone care, solving common problems and preventing breakdowns',
    backToHome: 'Back to Home',

    // Kontakt page
    kontaktPageTitle: 'Contacts',
    kontaktPageDescription: 'We are located in the center of Prague. Visit us or get in touch in a convenient way.',

    // ContactSection
    addressTitle: 'Address',
    transportTitle: 'Transport',
    transportStop: 'Stop: Lipanská',
    transportTrams: 'Trams: 5, 9, 15, 26',
    openingHoursTitle: 'Opening Hours',
    weekdaysHours: 'Monday - Friday: 9:00 - 19:00',
    saturdayHours: 'Saturday: 10:30 - 17:30',

    // Pricelist page
    pricelistTitle: 'Apple Device Repair in Prague',
    pricelistContentTitle: 'Apple Repair in Prague',
    pricelistCategoryQuestion: 'Which device needs repair? Knowing your device model helps us determine the cost and timeframe more accurately.',
    pricelistIntro: 'Has your iPhone, iPad or MacBook stopped turning on, broken, drowned or just started working unstably? Welcome to the HackLab service center.',
    pricelistWhyUs: 'Why choose us?',
    pricelistWhyUsText1: 'We provide fast and professional repair of all Apple equipment of any complexity. Our specialists will fix any malfunction, accurately determine the causes of the breakdown and restore your device to perfect working condition. HackLab is known in Prague for its speed and service quality — urgent replacement of the display, battery, buttons or cables takes from 30 minutes.',
    pricelistWhyUsText2: 'We have been working with Apple equipment for more than 10 years and have accumulated vast experience in restoring iPhones, iPads and MacBooks. We cooperate only with verified suppliers of original parts, which guarantees the reliability and durability of repairs.',
    pricelistWhyUsText3: 'We value your time and understand how difficult it is to be without communication. Therefore, if you cannot personally bring your device to our service, order a HackLab courier — we will pick up the gadget, repair it and return it back as soon as possible.',
    pricelistFooter: 'HackLab — fast, high quality and caring for your device.',

    // DeviceModelGrid
    selectModelForPriceList: 'Select a model to view the price list',
    modelsNotFound: 'No models found',
    categoriesUnavailable: 'Categories temporarily unavailable',
    tryRefresh: 'Try refreshing the page',

    // Footer
    footerAbout: 'HackLab provides exclusive service and repair for products; namely iPhone, iPad, MacBook and Apple Watch.',
    footerLinksTitle: 'Also Visit',
    footerArticles: 'Articles',
    footerPricelist: 'Price List',
    footerContacts: 'Contacts',
    footerHoursTitle: 'Opening Hours',
    footerMonday: 'Monday: 09:00 - 19:00',
    footerTuesday: 'Tuesday: 09:00 - 19:00',
    footerWednesday: 'Wednesday: 09:00 - 19:00',
    footerThursday: 'Thursday: 09:00 - 19:00',
    footerFriday: 'Friday: 09:00 - 19:00',
    footerSaturday: 'Saturday: 10:30 - 17:30',
    footerSunday: 'Sunday: closed',
    footerContactTitle: 'Contact Us:',
    footerCopyright: 'Copyright © 2025',
  },
  cz: {
    // ServicePriceTable
    servicePriceTableTitle: 'Ceník oprav',
    service: 'Služba',
    price: 'Cena',
    warranty: 'Záruka',
    months: 'měs.',
    discountNotice: '* Při více akcích se uplatňuje maximální sleva. Slevy se nesčítají.',

    // Breadcrumbs
    home: 'Domů',
    pricelist: 'Ceník',
    repair: 'Oprava',

    // Category names
    iphone: 'iPhone',
    ipad: 'iPad',
    macbook: 'MacBook',
    appleWatch: 'Apple Watch',

    // Empty states
    pricesSoonTitle: 'Ceny budou brzy přidány',
    pricesSoonDescription: 'Pracujeme na aktualizaci ceníku pro {model}. Kontaktujte nás prosím pro upřesnění ceny opravy.',
    call: 'Zavolat',
    writeToTelegram: 'Napsat na Telegram',
    servicesUnavailableTitle: 'Služby pro tento model jsou dočasně nedostupné',
    servicesUnavailableDescription: 'Kontaktujte nás prosím pro informace',
    imageSoon: 'Obrázek bude brzy k dispozici',

    // Info blocks
    repairLiveTitle: 'Oprava LIVE',
    repairLiveDescription: 'Sledujte proces opravy v reálném čase',
    bookLiveStream: 'Rezervace sledování',
    liveStreamFormTitle: 'Přístup k přenosu',
    liveStreamFormDescription: 'Zadejte přihlašovací údaje pro přístup k živému přenosu opravy',
    loginPlaceholder: 'Přihlášení',
    passwordPlaceholder: 'Heslo',
    submitAccess: 'Získat přístup',
    cancel: 'Zrušit',
    repairOnSiteTitle: 'Oprava na místě',
    repairOnSiteDescription: 'Zatímco čekáte - opravujeme',
    warrantyTitle: '2 roky záruky',
    warrantyDescription: 'Jistota kvality našich služeb',

    // Contact block
    readyToRepair: 'Jste připraveni začít opravu? Kontaktujte nás hned teď',
    telegram: 'Telegram',

    // ServiceRow
    free: 'ZDARMA',
    onRequest: 'Na vyžádání',
    from: 'od',
    clarify: 'Kontaktujte nás',
    minutes: 'min',
    hours: 'h',

    // Header
    pricelistMenu: 'Ceník',
    aboutMenu: 'O nás',
    contactsMenu: 'Kontakty',
    languageLabel: 'Jazyk',

    // HeroSection
    repairIphone: 'Oprava iPhone',
    repairMacbook: 'Oprava MacBook',
    repairIpad: 'Oprava iPad',
    repairAppleWatch: 'Oprava Apple Watch',

    // CommonIssues
    commonIssuesTitle: 'Opravujeme časté závady',
    notTurningOn: 'Nezapne se',
    liquidDamage: 'Poškození tekutinou',
    brokenGlass: 'Rozbité sklo',
    noNetwork: 'Nechytá síť',
    notCharging: 'Nenabíjí se',
    speakerNotWorking: 'Reproduktor nefunguje',

    // ArticlesSection
    articlesTitle: 'Články',
    articlesDescription: 'Užitečné tipy a doporučení pro péči o váš smartphone',
    viewAllArticles: 'Zobrazit všechny články',

    // ServiceSection
    serviceSectionTitle: 'Neskrýváme proces — důvěra se rodí v transparentnosti',
    serviceSectionDescription: 'Profesionální a rychlý servis zařízení.',
    feature1: 'Chcete vidět, jak probíhá oprava vašeho telefonu? Poskytujeme tuto možnost online',
    feature2: 'Profesionální diagnostika',
    feature3: 'Rychlá oprava',
    feature4: '2 roky záruky',
    feature5: 'Slevy na vícenásobné opravy',
    bulkDiscountText: '',

    // AboutSection
    aboutTitle: 'HackLab – Váš spolehlivý servisní centrum Apple v Praze',
    aboutIntro1: 'HackLab je moderní a spolehlivé servisní centrum Apple v Praze, kterému důvěřují majitelé zařízení Apple a dalších značek. Dokonce i nejodolnější zařízení časem vyžadují pozornost — náhodné pády, nárazy, poškození tekutinou nebo prostě opotřebení komponentů mohou vést k poruchám a závadám.',
    aboutIntro2: 'Naši specialisté denně obnovují desítky iPhonů, iPadů, MacBooků, Apple Watch a dalších zařízení, vracejí je k perfektnímu fungování. Chápeme, jak důležitá jsou vaše zařízení, proto děláme vše pro to, aby oprava zabrala minimální čas a přinesla maximální výsledky.',
    whyChooseTitle: 'Proč zvolit HackLab',
    whyChooseIntro: 'Dnes v Praze můžete najít mnoho servisů nabízejících opravu Apple. Ale pokud si ceníte kvality, transparentnosti a profesionality — HackLab se stane vaším spolehlivým partnerem. Nabízíme:',
    whyFeature1: 'originální díly a ověřené komponenty',
    whyFeature2: 'přesnou diagnostiku a profesionální přístup ke každému zařízení',
    whyFeature3: 'kvalifikované techniky s více než 5 lety zkušeností',
    whyFeature4: 'pohodlné lokace servisních center v různých částech Prahy',
    whyFeature5: 'záruku na všechny druhy prací a dílů',
    whyChooseOutro: 'Naše dílny jsou vybaveny moderním zařízením, což nám umožňuje provádět i komponentní opravy — výměnu čipů, obnovu základních desek, pájení kontaktů a mnoho dalšího.',
    whatWeRepairTitle: 'Co opravujeme',
    whatWeRepairIntro: 'V HackLabu můžete získat profesionální opravu jakékoliv složitosti:',
    repairService1: 'výměna displeje nebo skla',
    repairService2: 'obnova po poškození vodou',
    repairService3: 'odstranění následků pádů a nárazů',
    repairService4: 'výměna baterie',
    repairService5: 'oprava konektorů a tlačítek',
    repairService6: 'aktualizace firmwaru a systému',
    repairService7: 'obnova dat a odemknutí zařízení',
    whatWeRepairOutro: 'Pokud váš iPhone zamrzá, samovolně se vypíná, nenabíjí se nebo nereaguje na dotyk — jednoduše ho přineste k nám. Provedeme diagnostiku a nabídneme optimální řešení z hlediska času a nákladů.',
    diagnosticsTitle: 'Profesionální diagnostika a servis',
    diagnosticsText1: 'Každé zařízení prochází podrobnou diagnostikou před zahájením opravy. To nám umožňuje přesně určit příčinu poruchy a vybrat správnou metodu obnovy.',
    diagnosticsText2: 'Po dokončení všech prací provádíme testování, abychom se ujistili, že zařízení funguje jako nové.',
    diagnosticsText3: 'HackLab je servis, který si cení kvality, poctivosti a pohodlí zákazníka. Neopravujeme jen zařízení — obnovujeme vaše pohodlí, produktivitu a klid.',
    courierTitle: 'Kurýrní doručení a vzdálený servis',
    courierText: 'Pokud nemáte čas přijít osobně — žádný problém. Nabízíme kurýrní doručení po celé České republice: stačí nechat žádost na webu a my zorganizujeme vyzvednutí zařízení z vašeho domova nebo kanceláře. Po opravě bude vaše zařízení okamžitě doručeno zpět v funkčním stavu.',
    weFixTitle: 'We don\'t hack, we fix!',
    weFixText1: 'Každý měsíc stále více zákazníků volí HackLab za kvalitu, rychlost a pozornost k detailům. Neustále rozšiřujeme naši síť servisních center v Praze, abychom byli ještě blíže vám a vašim zařízením.',
    weFixText2: 'HackLab je tým profesionálů, pro které je oprava Apple a další elektroniky nejen práce, ale skutečné povolání.',
    weFixText3: 'Svěřte své zařízení expertům a bude znovu fungovat bezchybně, stejně jako první den.',

    // Articles page
    articlesPageTitle: 'Články o opravách telefonů',
    articlesPageDescription: 'Užitečné tipy pro péči o smartphony, řešení běžných problémů a prevenci poruch',
    backToHome: 'Zpět na hlavní stránku',

    // Kontakt page
    kontaktPageTitle: 'Kontakty',
    kontaktPageDescription: 'Nacházíme se v centru Prahy. Navštivte nás nebo se obraťte vhodným způsobem.',

    // ContactSection
    addressTitle: 'Adresa',
    transportTitle: 'Doprava',
    transportStop: 'Zastávka: Lipanská',
    transportTrams: 'Tramvaje: 5, 9, 15, 26',
    openingHoursTitle: 'Otevírací doba',
    weekdaysHours: 'Pondělí - Pátek: 9:00 - 19:00',
    saturdayHours: 'Sobota: 10:30 - 17:30',

    // Pricelist page
    pricelistTitle: 'Oprava zařízení Apple v Praze',
    pricelistContentTitle: 'Oprava Apple v Praze',
    pricelistCategoryQuestion: 'Které zařízení potřebuje opravu? Znalost modelu vašeho zařízení nám pomůže přesněji určit cenu a dobu opravy.',
    pricelistIntro: 'Váš iPhone, iPad nebo MacBook přestal se zapínat, rozbil se, utopiL se nebo začal fungovat nestabilně? Vítejte v servisním centru HackLab.',
    pricelistWhyUs: 'Proč právě my?',
    pricelistWhyUsText1: 'Provádíme rychlou a profesionální opravu všech zařízení Apple jakékoli složitosti. Naši specialisté odstraní jakékoli závady, přesně určí příčiny poruchy a vrátí vašemu zařízení dokonalý provoz. HackLab je v Praze známý svou rychlostí a kvalitou služeb — naléhavá výměna displeje, baterie, tlačítek nebo kabelů trvá od 30 minut.',
    pricelistWhyUsText2: 'S technikou Apple pracujeme již více než 10 let a nashromáždili jsme obrovské zkušenosti s obnovou iPhonů, iPadů a MacBooků. Spolupracujeme pouze s ověřenými dodavateli originálních náhradních dílů, což zaručuje spolehlivost a trvanlivost oprav.',
    pricelistWhyUsText3: 'Ceníme si vašeho času a chápeme, jak obtížné je být bez komunikace. Proto, pokud nemůžete osobně přivézt zařízení do našeho servisu, objednejte si kurýra HackLab — vyzvednem gadget, opravíme ho a vrátíme zpět co nejdříve.',
    pricelistFooter: 'HackLab — rychle, kvalitně a s péčí o vaše zařízení.',

    // DeviceModelGrid
    selectModelForPriceList: 'Vyberte model pro zobrazení ceníku',
    modelsNotFound: 'Nenalezeny žádné modely',
    categoriesUnavailable: 'Kategorie dočasně nedostupné',
    tryRefresh: 'Zkuste obnovit stránku',

    // Footer
    footerAbout: 'HackLab poskytuje exkluzivní servis a opravy produktů; konkrétně iPhone, iPad, MacBook a Apple Watch.',
    footerLinksTitle: 'Navštivte také',
    footerArticles: 'Články',
    footerPricelist: 'Ceník',
    footerContacts: 'Kontakty',
    footerHoursTitle: 'Otevírací doba',
    footerMonday: 'Pondělí: 09:00 - 19:00',
    footerTuesday: 'Úterý: 09:00 - 19:00',
    footerWednesday: 'Středa: 09:00 - 19:00',
    footerThursday: 'Čtvrtek: 09:00 - 19:00',
    footerFriday: 'Pátek: 09:00 - 19:00',
    footerSaturday: 'Sobota: 10:30 - 17:30',
    footerSunday: 'Neděle: zavřeno',
    footerContactTitle: 'Kontaktujte nás:',
    footerCopyright: 'Copyright © 2025',
  },
} as const;

/**
 * Получить переводы для указанного языка
 */
export function getTranslations(locale: Locale = DEFAULT_LOCALE) {
  return translations[locale] || translations[DEFAULT_LOCALE];
}

/**
 * Форматировать строку с подстановкой параметров
 * Например: formatMessage("Hello {name}", { name: "World" }) => "Hello World"
 */
export function formatMessage(template: string, params?: Record<string, string>): string {
  if (!params) return template;

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  );
}

/**
 * Получить имя сервиса на нужном языке
 */
export function getServiceName(service: { name_ru: string; name_en: string; name_cz: string }, locale: Locale = DEFAULT_LOCALE): string {
  const nameMap = {
    ru: service.name_ru,
    en: service.name_en,
    cz: service.name_cz,
  };
  return nameMap[locale] || service.name_ru;
}

/**
 * Получить описание сервиса на нужном языке
 */
export function getServiceDescription(
  service: { description_ru?: string | null; description_en?: string | null; description_cz?: string | null },
  locale: Locale = DEFAULT_LOCALE
): string | null {
  const descMap = {
    ru: service.description_ru,
    en: service.description_en,
    cz: service.description_cz,
  };
  return descMap[locale] || service.description_ru || null;
}

/**
 * Получить название категории на нужном языке
 */
export function getCategoryName(categorySlug: string, locale: Locale = DEFAULT_LOCALE): string {
  const t = getTranslations(locale);
  const categoryMap: Record<string, string> = {
    'iphone': t.iphone,
    'ipad': t.ipad,
    'macbook': t.macbook,
    'apple-watch': t.appleWatch,
  };
  return categoryMap[categorySlug] || categorySlug;
}

/**
 * Получить локализованную строку из объекта с переводами
 */
export function getLocalizedString(
  localized: { ru: string; en: string; cz: string },
  locale: Locale = DEFAULT_LOCALE
): string {
  return localized[locale] || localized[DEFAULT_LOCALE];
}
