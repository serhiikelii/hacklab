/**
 * Типы для системы прайс-листа MojService
 *
 * ⚠️ ВАЖНО: База данных была полностью переработана!
 *
 * АКТУАЛЬНЫЕ ТИПЫ (используйте эти):
 * - Service (с полями name_ru, name_en, name_cz, price_type)
 * - ServicePrice (с полем warranty_months)
 * - DeviceModel (с полем image_url)
 * - PriceType
 *
 * УСТАРЕВШИЕ ДАННЫЕ (НЕ ИСПОЛЬЗУЙТЕ):
 * - MAIN_SERVICES[] - список услуг устарел, берите из БД
 * - EXTRA_SERVICES[] - список услуг устарел, берите из БД
 * - DEVICE_CATEGORIES - данные устарели, берите из БД
 * - PRICELIST_STATS - статистика устарела
 * - DISCOUNTS - данные могут быть неактуальными
 *
 * Все данные теперь загружаются из БД через API endpoints.
 */

// ========== Категории устройств ==========

export type DeviceCategory = 'iphone' | 'ipad' | 'macbook' | 'apple-watch';

export interface CategoryInfo {
  id: DeviceCategory;
  name: string;
  icon: string; // Emoji или иконка
  description: string;
  modelCount: number;
}

// ========== Модели устройств ==========

export interface DeviceModel {
  id: string;
  slug: string; // URL-friendly, например "iphone-15-pro-max"
  category: DeviceCategory;
  name: string;
  series?: string | null; // Например: "iPhone 15", "iPad Air"
  release_year?: number | null;
  image_url?: string | null;
  is_popular?: boolean;
}

// ========== Услуги и цены ==========

export type PriceType = 'free' | 'fixed' | 'from' | 'on_request';

export interface Service {
  id: string;
  slug: string; // Например: "battery-replacement"
  name_en: string;
  name_cz: string;
  name_ru: string;
  description_en?: string | null;
  description_cz?: string | null;
  description_ru?: string | null;
  category_id?: string; // ID категории услуг
  category: 'main' | 'extra'; // Основные или дополнительные услуги
  price_type: PriceType;
  duration_minutes?: number | null;
}

export interface ServicePrice {
  serviceId: string;
  modelId: string;
  price?: number | null; // В кронах (CZK), null если on_request
  price_type?: PriceType; // Тип цены (из БД)
  currency: 'CZK';
  duration?: number | null; // Длительность в минутах
  warranty_months?: number | null; // Гарантия в месяцах (обычно 24)
  note_ru?: string | null; // Дополнительная информация (русский)
  note_en?: string | null; // Дополнительная информация (английский)
  note_cz?: string | null; // Дополнительная информация (чешский)
  is_active?: boolean; // Активность цены
}

// ========== Связи категорий и услуг ==========

export interface CategoryService {
  id: string;
  category_id: string;
  service_id: string;
  is_primary: boolean;
  created_at: string;
}

// ========== Скидки ==========

export interface Discount {
  id: string;
  name_ru: string;
  name_en: string;
  name_cz: string;
  type: 'percentage' | 'fixed' | 'bonus';
  value: string; // "5%", "10%", "+1 app" и т.д.
  description_ru?: string;
  description_en?: string;
  description_cz?: string;
  conditions_ru?: string;
  conditions_en?: string;
  conditions_cz?: string;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

// ========== Компоненты прайс-листа ==========

export interface DeviceCategoryGridProps {
  categories: CategoryInfo[];
  onCategorySelect?: (category: DeviceCategory) => void;
}

export interface DeviceModelGridProps {
  category: DeviceCategory;
  models: DeviceModel[];
  onModelSelect?: (model: DeviceModel) => void;
}

export interface ServicePriceTableProps {
  model: DeviceModel;
  services: Service[];
  prices: ServicePrice[];
  onReserve?: (service: Service, model: DeviceModel) => void;
}

export interface ServiceRowProps {
  service: Service;
  price: ServicePrice;
  onReserve?: () => void;
}

// ========== УСТАРЕВШИЕ ДАННЫЕ - НЕ ИСПОЛЬЗОВАТЬ ==========
// TODO: Удалить после миграции всех компонентов на новую архитектуру БД

/**
 * @deprecated Устаревшая статистика. Данные теперь берутся из БД напрямую.
 * Оставлено для обратной совместимости, будет удалено в будущих версиях.
 */
export const PRICELIST_STATS = {
  totalModels: 107,
  totalCategories: 4,
  totalServiceTypes: 24,
  estimatedPriceRecords: 2568, // 107 × 24
} as const;

/**
 * @deprecated Устаревшие категории устройств. Данные теперь берутся из БД.
 * Оставлено для обратной совместимости, будет удалено в будущих версиях.
 */
export const DEVICE_CATEGORIES: Record<DeviceCategory, CategoryInfo> = {
  iphone: {
    id: 'iphone',
    name: 'iPhone',
    icon: '📱',
    description: 'Ремонт iPhone всех моделей',
    modelCount: 40,
  },
  ipad: {
    id: 'ipad',
    name: 'iPad',
    icon: '📱',
    description: 'Ремонт iPad всех моделей',
    modelCount: 24,
  },
  macbook: {
    id: 'macbook',
    name: 'MacBook',
    icon: '💻',
    description: 'Ремонт MacBook всех моделей',
    modelCount: 32,
  },
  'apple-watch': {
    id: 'apple-watch',
    name: 'Apple Watch',
    icon: '⌚',
    description: 'Ремонт Apple Watch',
    modelCount: 11,
  },
} as const;

/**
 * @deprecated Устаревший список основных услуг.
 * ВНИМАНИЕ: Данные НЕ соответствуют текущей БД!
 * Используйте данные из API /api/services вместо этих констант.
 * Оставлено для обратной совместимости, будет удалено в будущих версиях.
 */
/**
 * Mock services from actual database seed data (002_seed_data.sql)
 * These services match the actual database structure
 */
export const MAIN_SERVICES: Service[] = [
  // iPhone services - using slug as ID for mock data
  { id: 'iphone-display-original-prc', slug: 'iphone-display-original-prc', name_en: 'Display Replacement Original PRC', name_cz: 'Výměna displeje originál PRC', name_ru: 'Замена дисплея оригинал PRC', price_type: 'fixed', category: 'main' },
  { id: 'iphone-display-analog', slug: 'iphone-display-analog', name_en: 'Display Replacement (Analog)', name_cz: 'Výměna displeje (analog)', name_ru: 'Замена дисплея (аналог)', price_type: 'fixed', category: 'main' },
  { id: 'iphone-battery', slug: 'iphone-battery', name_en: 'Battery Replacement', name_cz: 'Výměna baterie', name_ru: 'Замена аккумулятора', price_type: 'fixed', category: 'main' },
  { id: 'iphone-back-glass', slug: 'iphone-back-glass', name_en: 'Back Glass Replacement', name_cz: 'Výměna zadního skla', name_ru: 'Замена заднего стеклокорпуса', price_type: 'fixed', category: 'main' },
  { id: 'iphone-housing', slug: 'iphone-housing', name_en: 'Housing Replacement', name_cz: 'Výměna krytu', name_ru: 'Замена корпуса', price_type: 'fixed', category: 'main' },
  { id: 'iphone-camera-main', slug: 'iphone-camera-main', name_en: 'Main Camera Replacement', name_cz: 'Výměna hlavní kamery', name_ru: 'Замена основной камеры', price_type: 'fixed', category: 'main' },
  { id: 'iphone-charging-cable', slug: 'iphone-charging-cable', name_en: 'Charging Cable Replacement', name_cz: 'Výměna nabíjecího kabelu', name_ru: 'Замена шлейфа зарядки', price_type: 'fixed', category: 'main' },
  { id: 'iphone-water-damage', slug: 'iphone-water-damage', name_en: 'Water Damage Recovery', name_cz: 'Obnova po poškození vodou', name_ru: 'Восстановление от повреждения водой', price_type: 'from', category: 'main' },

  // iPad services
  { id: 'ipad-glass', slug: 'ipad-glass', name_en: 'Display Glass Replacement', name_cz: 'Výměna skla displeje', name_ru: 'Замена стекла дисплея', price_type: 'fixed', category: 'main' },
  { id: 'ipad-digitizer', slug: 'ipad-digitizer', name_en: 'Digitizer Replacement', name_cz: 'Výměna digitizéru', name_ru: 'Замена сенсора дисплея', price_type: 'fixed', category: 'main' },
  { id: 'ipad-display-original', slug: 'ipad-display-original', name_en: 'Display Replacement Original', name_cz: 'Výměna displeje originál', name_ru: 'Замена дисплея оригинал', price_type: 'fixed', category: 'main' },
  { id: 'ipad-battery', slug: 'ipad-battery', name_en: 'Battery Replacement', name_cz: 'Výměna baterie', name_ru: 'Замена аккумулятора', price_type: 'fixed', category: 'main' },
  { id: 'ipad-water-damage', slug: 'ipad-water-damage', name_en: 'Water Damage Recovery', name_cz: 'Obnova po poškození vodou', name_ru: 'Восстановление от повреждения водой', price_type: 'from', category: 'main' },
  { id: 'ipad-charging-port', slug: 'ipad-charging-port', name_en: 'Charging Port Replacement', name_cz: 'Výměna nabíjecího portu', name_ru: 'Замена разъема зарядки', price_type: 'fixed', category: 'main' },

  // MacBook services
  { id: 'macbook-display', slug: 'macbook-display', name_en: 'Display Replacement', name_cz: 'Výměna displeje', name_ru: 'Замена дисплея', price_type: 'fixed', category: 'main' },
  { id: 'macbook-battery', slug: 'macbook-battery', name_en: 'Battery Replacement', name_cz: 'Výměna baterie', name_ru: 'Замена аккумулятора', price_type: 'fixed', category: 'main' },
  { id: 'macbook-keyboard', slug: 'macbook-keyboard', name_en: 'Keyboard Replacement', name_cz: 'Výměna klávesnice', name_ru: 'Замена клавиатуры', price_type: 'fixed', category: 'main' },
  { id: 'macbook-thermal-paste', slug: 'macbook-thermal-paste', name_en: 'Cleaning, Thermal Paste Replacement', name_cz: 'Čištění, výměna termální pasty', name_ru: 'Чистка, замена термопасты', price_type: 'fixed', category: 'main' },

  // Apple Watch services
  { id: 'watch-glass', slug: 'watch-glass', name_en: 'Glass Replacement', name_cz: 'Výměna skla', name_ru: 'Замена стекла', price_type: 'fixed', category: 'main' },
  { id: 'watch-digitizer', slug: 'watch-digitizer', name_en: 'Digitizer Replacement', name_cz: 'Výměna senzoru', name_ru: 'Замена сенсора', price_type: 'fixed', category: 'main' },
  { id: 'watch-display', slug: 'watch-display', name_en: 'Display Replacement', name_cz: 'Výměna displeje', name_ru: 'Замена дисплея', price_type: 'fixed', category: 'main' },
  { id: 'watch-battery', slug: 'watch-battery', name_en: 'Battery Replacement', name_cz: 'Výměna baterie', name_ru: 'Замена аккумулятора', price_type: 'fixed', category: 'main' },
  { id: 'watch-nfc', slug: 'watch-nfc', name_en: 'NFC Recovery', name_cz: 'Obnova NFC', name_ru: 'Восстановление NFC', price_type: 'fixed', category: 'main' },
];

/**
 * @deprecated Устаревший список дополнительных услуг.
 * ВНИМАНИЕ: Данные НЕ соответствуют текущей БД!
 * Используйте данные из API /api/services вместо этих констант.
 * Оставлено для обратной совместимости, будет удалено в будущих версиях.
 */
export const EXTRA_SERVICES: Service[] = [
  { id: '20', slug: 'glass-foil-installation', name_en: 'Professional installation of glass/foil', name_cz: '', name_ru: '', price_type: 'fixed', category: 'extra' },
  { id: '21', slug: 'glass-foil-whole-body', name_en: 'Professional installation of glass/foil on whole body', name_cz: '', name_ru: '', price_type: 'fixed', category: 'extra' },
  { id: '22', slug: 'mechanical-cleaning', name_en: 'Mechanical cleaning (prolongs service life)', name_cz: '', name_ru: '', price_type: 'from', category: 'extra' },
  { id: '23', slug: 'service-report', name_en: 'Issuance of service report', name_cz: '', name_ru: '', price_type: 'free', category: 'extra' },
  { id: '24', slug: 'sim-card-cutting', name_en: 'Cutting out the SIM card to smaller size', name_cz: '', name_ru: '', price_type: 'free', category: 'extra' },
];

/**
 * @deprecated Устаревший список скидок.
 * ВНИМАНИЕ: Данные могут НЕ соответствовать текущим акциям!
 * Используйте данные из БД или актуальной документации.
 * Оставлено для обратной совместимости, будет удалено в будущих версиях.
 */
export const DISCOUNTS: Discount[] = [
  { id: '1', name_ru: 'Скидка подписчикам Facebook', name_en: 'Facebook followers discount', name_cz: 'Sleva pro followery na Facebooku', type: 'percentage', value: '5%' },
  { id: '2', name_ru: 'Студенческая скидка', name_en: 'Student discount', name_cz: 'Studentská sleva', type: 'percentage', value: '10%' },
  { id: '3', name_ru: 'Скидка за несколько услуг', name_en: 'Bulk discount', name_cz: 'Sleva za více služeb', type: 'percentage', value: 'variable' },
  { id: '4', name_ru: 'Скидка на следующий ремонт', name_en: 'Discount on next purchase', name_cz: 'Sleva na další opravu', type: 'percentage', value: '10%' },
  { id: '5', name_ru: 'Бесплатное приложение после ремонта', name_en: 'Free app after any repair', name_cz: 'Aplikace zdarma po opravě', type: 'bonus', value: '+1' },
];
