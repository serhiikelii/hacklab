/**
 * Pricelist Components - MojService pricelist system components
 *
 * This module provides all necessary components for creating
 * a full-featured pricelist system with ~102 device models.
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
