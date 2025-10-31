/**
 * Типы для системы прайс-листа MojService
 *
 * Основано на анализе appleguru.cz и документации проекта.
 * Поддерживает ~102 модели устройств в 4 категориях.
 */

// ========== Категории устройств ==========

export type DeviceCategory = 'iphone' | 'ipad' | 'mac' | 'watch';

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
  series?: string; // Например: "iPhone 15", "iPad Air"
  releaseYear?: number;
  imageUrl?: string;
  isPopular?: boolean;
}

// ========== Услуги и цены ==========

export type PriceType = 'free' | 'fixed' | 'from' | 'on_request';

export interface Service {
  id: string;
  slug: string; // Например: "battery-replacement"
  nameEn: string;
  nameCz?: string;
  nameRu?: string;
  description?: string;
  category: 'main' | 'extra'; // Основные или дополнительные услуги
  priceType: PriceType;
}

export interface ServicePrice {
  serviceId: string;
  modelId: string;
  price?: number; // В кронах (CZK), undefined если on_request
  currency: 'CZK';
  duration?: number; // Длительность в минутах
  warranty?: number; // Гарантия в месяцах (обычно 24)
  note?: string; // Дополнительная информация
}

// ========== Скидки ==========

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bonus';
  value: string; // "5%", "10%", "+1 app" и т.д.
  description?: string;
  conditions?: string;
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

// ========== Данные из документации ==========

/**
 * Статистика из документа "Полная структура прайс-листа"
 */
export const PRICELIST_STATS = {
  totalModels: 107,
  totalCategories: 4,
  totalServiceTypes: 24,
  estimatedPriceRecords: 2568, // 107 × 24
} as const;

/**
 * Категории устройств (из документации)
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
  mac: {
    id: 'mac',
    name: 'MacBook',
    icon: '💻',
    description: 'Ремонт MacBook всех моделей',
    modelCount: 32,
  },
  watch: {
    id: 'watch',
    name: 'Apple Watch',
    icon: '⌚',
    description: 'Ремонт Apple Watch',
    modelCount: 11,
  },
} as const;

/**
 * Основные услуги (из документации)
 */
export const MAIN_SERVICES: Service[] = [
  { id: '1', slug: 'diagnostics', nameEn: 'Diagnostics', priceType: 'free', category: 'main' },
  { id: '2', slug: 'replacing-broken-glass', nameEn: 'Replacing broken glass', priceType: 'fixed', category: 'main' },
  { id: '3', slug: 'replacement-front-panel', nameEn: 'Replacement of the front panel', priceType: 'fixed', category: 'main' },
  { id: '4', slug: 'battery-replacement', nameEn: 'Battery replacement', priceType: 'fixed', category: 'main' },
  { id: '5', slug: 'replacing-rear-glass', nameEn: 'Replacing the rear glass', priceType: 'fixed', category: 'main' },
  { id: '6', slug: 'replacing-power-button', nameEn: 'Replacing the power button', priceType: 'fixed', category: 'main' },
  { id: '7', slug: 'replacing-volume-buttons', nameEn: 'Replacing the volume buttons', priceType: 'fixed', category: 'main' },
  { id: '8', slug: 'replacing-volume-switch', nameEn: 'Replacing the volume switch', priceType: 'fixed', category: 'main' },
  { id: '9', slug: 'replacing-power-connector', nameEn: 'Replacing the power connector', priceType: 'fixed', category: 'main' },
  { id: '10', slug: 'replacing-microphone', nameEn: 'Replacing the microphone', priceType: 'fixed', category: 'main' },
  { id: '11', slug: 'replacing-loudspeaker', nameEn: 'Replacing the loudspeaker', priceType: 'fixed', category: 'main' },
  { id: '12', slug: 'ear-speaker-replacement', nameEn: 'Ear speaker replacement', priceType: 'fixed', category: 'main' },
  { id: '13', slug: 'rear-camera-replacement', nameEn: 'Rear camera replacement', priceType: 'fixed', category: 'main' },
  { id: '14', slug: 'rear-camera-glass-replacement', nameEn: 'Rear camera glass replacement', priceType: 'fixed', category: 'main' },
  { id: '15', slug: 'front-camera-replacement', nameEn: 'Front camera replacement', priceType: 'fixed', category: 'main' },
  { id: '16', slug: 'frame-straightening', nameEn: 'Frame straightening', priceType: 'from', category: 'main' },
  { id: '17', slug: 'repair-liquid-ingress', nameEn: 'Repair after liquid ingress', priceType: 'from', category: 'main' },
  { id: '18', slug: 'motherboard-repair', nameEn: 'Motherboard repair', priceType: 'on_request', category: 'main' },
  { id: '19', slug: 'software-recovery', nameEn: 'Software (recovery, unblocking)', priceType: 'from', category: 'main' },
];

/**
 * Дополнительные услуги (из документации)
 */
export const EXTRA_SERVICES: Service[] = [
  { id: '20', slug: 'glass-foil-installation', nameEn: 'Professional installation of glass/foil', priceType: 'fixed', category: 'extra' },
  { id: '21', slug: 'glass-foil-whole-body', nameEn: 'Professional installation of glass/foil on whole body', priceType: 'fixed', category: 'extra' },
  { id: '22', slug: 'mechanical-cleaning', nameEn: 'Mechanical cleaning (prolongs service life)', priceType: 'from', category: 'extra' },
  { id: '23', slug: 'service-report', nameEn: 'Issuance of service report', priceType: 'free', category: 'extra' },
  { id: '24', slug: 'sim-card-cutting', nameEn: 'Cutting out the SIM card to smaller size', priceType: 'free', category: 'extra' },
];

/**
 * Скидки (из документации)
 */
export const DISCOUNTS: Discount[] = [
  { id: '1', name: 'Facebook followers discount', type: 'percentage', value: '5%' },
  { id: '2', name: 'Student discount', type: 'percentage', value: '10%' },
  { id: '3', name: 'Bulk discount', type: 'percentage', value: 'variable' },
  { id: '4', name: 'Discount on next purchase', type: 'percentage', value: '10%' },
  { id: '5', name: 'Free app after any repair', type: 'bonus', value: '+1' },
];
