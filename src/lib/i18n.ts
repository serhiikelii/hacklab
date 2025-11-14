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
    pricelistTitle: 'Прайс-лист услуг по ремонту',
    service: 'Услуга',
    price: 'Цена',
    warranty: 'Гарантия',
    months: 'мес.',

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
    repairOnSiteTitle: 'Ремонт на месте',
    repairOnSiteDescription: 'Пока вы ждете - мы ремонтируем',
    warrantyTitle: '2 года гарантии',
    warrantyDescription: 'Уверенность в качестве наших услуг',

    // Contact block
    readyToRepair: 'Готовы начать ремонт? Свяжитесь с нами прямо сейчас',
    telegram: 'Telegram',
  },
  en: {
    // ServicePriceTable
    pricelistTitle: 'Repair Services Price List',
    service: 'Service',
    price: 'Price',
    warranty: 'Warranty',
    months: 'mo.',

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
    repairOnSiteTitle: 'On-site repair',
    repairOnSiteDescription: 'While you wait - we repair',
    warrantyTitle: '2 years warranty',
    warrantyDescription: 'Confidence in the quality of our services',

    // Contact block
    readyToRepair: 'Ready to start the repair? Contact us right now',
    telegram: 'Telegram',
  },
  cz: {
    // ServicePriceTable
    pricelistTitle: 'Ceník oprav',
    service: 'Služba',
    price: 'Cena',
    warranty: 'Záruka',
    months: 'měs.',

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
    repairOnSiteTitle: 'Oprava na místě',
    repairOnSiteDescription: 'Zatímco čekáte - opravujeme',
    warrantyTitle: '2 roky záruky',
    warrantyDescription: 'Jistota kvality našich služeb',

    // Contact block
    readyToRepair: 'Jste připraveni začít opravu? Kontaktujte nás hned teď',
    telegram: 'Telegram',
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
