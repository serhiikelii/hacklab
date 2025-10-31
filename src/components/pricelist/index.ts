/**
 * Pricelist Components - компоненты системы прайс-листа MojService
 *
 * Этот модуль предоставляет все необходимые компоненты для создания
 * полнофункциональной системы прайс-листа с ~102 моделями устройств.
 *
 * @example
 * ```tsx
 * import {
 *   DeviceCategoryGrid,
 *   DeviceModelGrid,
 *   ServicePriceTable,
 * } from '@/components/pricelist';
 * ```
 */

// Main Components
export { DeviceCategoryGrid } from './DeviceCategoryGrid';
export type { DeviceCategoryGridProps } from './DeviceCategoryGrid';

export { DeviceModelGrid } from './DeviceModelGrid';
export type { DeviceModelGridProps } from './DeviceModelGrid';

export { ServicePriceTable } from './ServicePriceTable';
export type { ServicePriceTableProps } from './ServicePriceTable';

export { ServiceRow } from './ServiceRow';
export type { ServiceRowProps } from './ServiceRow';

// Re-export types and constants for convenience
export type {
  DeviceCategory,
  DeviceModel,
  Service,
  ServicePrice,
  CategoryInfo,
  Discount,
} from '@/types/pricelist';

export {
  DEVICE_CATEGORIES,
  MAIN_SERVICES,
  EXTRA_SERVICES,
  DISCOUNTS,
  PRICELIST_STATS,
} from '@/types/pricelist';
