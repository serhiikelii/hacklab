/**
 * Mock данные для демонстрации прайс-листа
 * В продакшене будут заменены на реальные данные из Supabase
 */

import type { DeviceModel, Service, ServicePrice } from '@/types/pricelist';

// Mock модели устройств
export const MOCK_MODELS: DeviceModel[] = [
  // iPhone (40 моделей)
  { id: '1', slug: 'iphone-16-pro-max', category: 'iphone', name: 'iPhone 16 Pro Max', series: 'iPhone 16', release_year: 2024, is_popular: true },
  { id: '2', slug: 'iphone-16-pro', category: 'iphone', name: 'iPhone 16 Pro', series: 'iPhone 16', release_year: 2024, is_popular: true },
  { id: '3', slug: 'iphone-16-plus', category: 'iphone', name: 'iPhone 16 Plus', series: 'iPhone 16', release_year: 2024, is_popular: true },
  { id: '4', slug: 'iphone-16', category: 'iphone', name: 'iPhone 16', series: 'iPhone 16', release_year: 2024, is_popular: true },
  { id: '5', slug: 'iphone-15-pro-max', category: 'iphone', name: 'iPhone 15 Pro Max', series: 'iPhone 15', release_year: 2023, is_popular: true },
  { id: '6', slug: 'iphone-15-pro', category: 'iphone', name: 'iPhone 15 Pro', series: 'iPhone 15', release_year: 2023, is_popular: true },
  { id: '7', slug: 'iphone-15-plus', category: 'iphone', name: 'iPhone 15 Plus', series: 'iPhone 15', release_year: 2023 },
  { id: '8', slug: 'iphone-15', category: 'iphone', name: 'iPhone 15', series: 'iPhone 15', release_year: 2023 },
  { id: '9', slug: 'iphone-14-pro-max', category: 'iphone', name: 'iPhone 14 Pro Max', series: 'iPhone 14', release_year: 2022 },
  { id: '10', slug: 'iphone-14-pro', category: 'iphone', name: 'iPhone 14 Pro', series: 'iPhone 14', release_year: 2022 },
  { id: '11', slug: 'iphone-14-plus', category: 'iphone', name: 'iPhone 14 Plus', series: 'iPhone 14', release_year: 2022 },
  { id: '12', slug: 'iphone-14', category: 'iphone', name: 'iPhone 14', series: 'iPhone 14', release_year: 2022 },

  // iPad (24 моделей)
  { id: '41', slug: 'ipad-pro-12-9-2024', category: 'ipad', name: 'iPad Pro 12.9" (2024)', series: 'iPad Pro', release_year: 2024, is_popular: true },
  { id: '42', slug: 'ipad-pro-11-2024', category: 'ipad', name: 'iPad Pro 11" (2024)', series: 'iPad Pro', release_year: 2024, is_popular: true },
  { id: '43', slug: 'ipad-air-5', category: 'ipad', name: 'iPad Air 5', series: 'iPad Air', release_year: 2022, is_popular: true },
  { id: '44', slug: 'ipad-air-4', category: 'ipad', name: 'iPad Air 4', series: 'iPad Air', release_year: 2020 },
  { id: '45', slug: 'ipad-mini-6', category: 'ipad', name: 'iPad mini 6', series: 'iPad mini', release_year: 2021 },
  { id: '46', slug: 'ipad-10', category: 'ipad', name: 'iPad 10', series: 'iPad', release_year: 2022 },

  // Mac (32 модели)
  // Row 1
  { id: '65', slug: 'macbook-pro-16-m4-a3403', category: 'macbook', name: 'MacBook Pro 16" M4 (A3403)', series: 'MacBook Pro M4', release_year: 2024, is_popular: true },
  { id: '66', slug: 'macbook-pro-14-m4-a3401', category: 'macbook', name: 'MacBook Pro 14" M4 (A3401)', series: 'MacBook Pro M4', release_year: 2024, is_popular: true },
  { id: '67', slug: 'macbook-pro-14-m4-a3112', category: 'macbook', name: 'MacBook Pro 14" M4 (A3112)', series: 'MacBook Pro M4', release_year: 2024, is_popular: true },
  { id: '68', slug: 'macbook-air-15-m3-a3114', category: 'macbook', name: 'MacBook Air 15" M3 (A3114)', series: 'MacBook Air M3', release_year: 2024, is_popular: true },
  // Row 2
  { id: '69', slug: 'macbook-pro-16-a2991', category: 'macbook', name: 'MacBook Pro 16" (A2991)', series: 'MacBook Pro', release_year: 2023 },
  { id: '70', slug: 'macbook-pro-16-a2780', category: 'macbook', name: 'MacBook Pro 16" (A2780)', series: 'MacBook Pro', release_year: 2023 },
  { id: '71', slug: 'macbook-pro-16-m1-a2485', category: 'macbook', name: 'MacBook Pro 16" M1 (A2485)', series: 'MacBook Pro M1', release_year: 2021 },
  { id: '72', slug: 'macbook-pro-16-a2141', category: 'macbook', name: 'MacBook Pro 16" (A2141)', series: 'MacBook Pro', release_year: 2019 },
  // Row 3
  { id: '73', slug: 'macbook-pro-15-a1990', category: 'macbook', name: 'MacBook Pro 15" (A1990)', series: 'MacBook Pro', release_year: 2018 },
  { id: '74', slug: 'macbook-pro-15-a1707', category: 'macbook', name: 'MacBook Pro 15" (A1707)', series: 'MacBook Pro', release_year: 2016 },
  { id: '75', slug: 'macbook-pro-15-a1398', category: 'macbook', name: 'MacBook Pro 15" (A1398)', series: 'MacBook Pro', release_year: 2015 },
  { id: '76', slug: 'macbook-pro-14-m3-a2992', category: 'macbook', name: 'MacBook Pro 14" M3 (A2992)', series: 'MacBook Pro M3', release_year: 2023 },
  // Row 4
  { id: '77', slug: 'macbook-pro-14-m3-a2918', category: 'macbook', name: 'MacBook Pro 14" M3 (A2918)', series: 'MacBook Pro M3', release_year: 2023 },
  { id: '78', slug: 'macbook-pro-14-m2-a2779', category: 'macbook', name: 'MacBook Pro 14" M2 (A2779)', series: 'MacBook Pro M2', release_year: 2023 },
  { id: '79', slug: 'macbook-pro-14-m1-a2442', category: 'macbook', name: 'MacBook Pro 14" M1 (A2442)', series: 'MacBook Pro M1', release_year: 2021 },
  { id: '80', slug: 'macbook-pro-13-m1-m2-a2338', category: 'macbook', name: 'MacBook Pro 13" M1/M2 (A2338)', series: 'MacBook Pro', release_year: 2022 },
  // Row 5
  { id: '81', slug: 'macbook-pro-13-a2251-a2289', category: 'macbook', name: 'MacBook Pro 13" (A2251,A2289)', series: 'MacBook Pro', release_year: 2020 },
  { id: '82', slug: 'macbook-pro-13-a2159', category: 'macbook', name: 'MacBook Pro 13" (A2159)', series: 'MacBook Pro', release_year: 2019 },
  { id: '83', slug: 'macbook-pro-13-a1989', category: 'macbook', name: 'MacBook Pro 13" (A1989)', series: 'MacBook Pro', release_year: 2018 },
  { id: '84', slug: 'macbook-pro-13-a1706-a1708', category: 'macbook', name: 'MacBook Pro 13" (A1706,A1708)', series: 'MacBook Pro', release_year: 2017 },
  // Row 6
  { id: '85', slug: 'macbook-pro-13-a1425-a1502', category: 'macbook', name: 'MacBook Pro 13" (A1425,A1502)', series: 'MacBook Pro', release_year: 2015 },
  { id: '86', slug: 'macbook-air-15-a2941', category: 'macbook', name: 'MacBook Air 15" (A2941)', series: 'MacBook Air', release_year: 2023 },
  { id: '87', slug: 'macbook-air-13-m3-a3113', category: 'macbook', name: 'MacBook Air 13" M3 (A3113)', series: 'MacBook Air M3', release_year: 2024 },
  { id: '88', slug: 'macbook-air-13-a2337', category: 'macbook', name: 'MacBook Air 13" (A2179)', series: 'MacBook Air', release_year: 2020 },
  // Row 7
  { id: '89', slug: 'macbook-air-13-m1-a2337', category: 'macbook', name: 'MacBook Air 13" M1 (A2337)', series: 'MacBook Air M1', release_year: 2020 },
  { id: '90', slug: 'macbook-air-13-a2179-2', category: 'macbook', name: 'MacBook Air 13" (A2179)', series: 'MacBook Air', release_year: 2020 },
  { id: '91', slug: 'macbook-air-13-a1932', category: 'macbook', name: 'MacBook Air 13" (A1932)', series: 'MacBook Air', release_year: 2018 },
  { id: '92', slug: 'macbook-air-11-a1370-a1465', category: 'macbook', name: 'MacBook Air 11" (A1370,A1465)', series: 'MacBook Air', release_year: 2015 },
  // Row 8
  { id: '93', slug: 'macbook-12-a1534', category: 'macbook', name: 'MacBook 12" (A1534)', series: 'MacBook', release_year: 2017 },

  // Watch (17 моделей)
  // Row 1
  { id: '101', slug: 'apple-watch-ultra-49mm', category: 'apple-watch', name: 'Apple Watch Ultra 49mm', series: 'Apple Watch Ultra', release_year: 2022, is_popular: true },
  { id: '102', slug: 'apple-watch-se-2-44mm', category: 'apple-watch', name: 'Apple Watch SE 2 44mm', series: 'Apple Watch SE 2', release_year: 2022, is_popular: true },
  { id: '103', slug: 'apple-watch-se-2-40mm', category: 'apple-watch', name: 'Apple Watch SE 2 40mm', series: 'Apple Watch SE 2', release_year: 2022, is_popular: true },
  { id: '104', slug: 'apple-watch-se-44mm', category: 'apple-watch', name: 'Apple Watch SE 44mm', series: 'Apple Watch SE', release_year: 2020, is_popular: true },
  // Row 2
  { id: '105', slug: 'apple-watch-se-40mm', category: 'apple-watch', name: 'Apple Watch SE 40mm', series: 'Apple Watch SE', release_year: 2020 },
  { id: '106', slug: 'apple-watch-series-8-45mm', category: 'apple-watch', name: 'Apple Watch Series 8 45mm', series: 'Apple Watch Series 8', release_year: 2022 },
  { id: '107', slug: 'apple-watch-series-8-41mm', category: 'apple-watch', name: 'Apple Watch Series 8 41mm', series: 'Apple Watch Series 8', release_year: 2022 },
  { id: '108', slug: 'apple-watch-series-7-45mm', category: 'apple-watch', name: 'Apple Watch Series 7 45mm', series: 'Apple Watch Series 7', release_year: 2021 },
  // Row 3
  { id: '109', slug: 'apple-watch-series-7-41mm', category: 'apple-watch', name: 'Apple Watch Series 7 41mm', series: 'Apple Watch Series 7', release_year: 2021 },
  { id: '110', slug: 'apple-watch-series-6-44mm', category: 'apple-watch', name: 'Apple Watch Series 6 44mm', series: 'Apple Watch Series 6', release_year: 2020 },
  { id: '111', slug: 'apple-watch-series-6-40mm', category: 'apple-watch', name: 'Apple Watch Series 6 40mm', series: 'Apple Watch Series 6', release_year: 2020 },
  { id: '112', slug: 'apple-watch-series-5-44mm', category: 'apple-watch', name: 'Apple Watch Series 5 44mm', series: 'Apple Watch Series 5', release_year: 2019 },
  // Row 4
  { id: '113', slug: 'apple-watch-series-5-40mm', category: 'apple-watch', name: 'Apple Watch Series 5 40mm', series: 'Apple Watch Series 5', release_year: 2019 },
  { id: '114', slug: 'apple-watch-series-4-44mm', category: 'apple-watch', name: 'Apple Watch Series 4 44mm', series: 'Apple Watch Series 4', release_year: 2018 },
  { id: '115', slug: 'apple-watch-series-4-40mm', category: 'apple-watch', name: 'Apple Watch Series 4 40mm', series: 'Apple Watch Series 4', release_year: 2018 },
  { id: '116', slug: 'apple-watch-series-3-42mm', category: 'apple-watch', name: 'Apple Watch Series 3 42mm', series: 'Apple Watch Series 3', release_year: 2017 },
  // Row 5
  { id: '117', slug: 'apple-watch-series-3-38mm', category: 'apple-watch', name: 'Apple Watch Series 3 38mm', series: 'Apple Watch Series 3', release_year: 2017 },
];

/**
 * Mock цены для демонстрации
 *
 * ⚠️ ВАЖНО: В БД используются UUID для service_id, но здесь мы используем slug-based моки
 * для совместимости с MAIN_SERVICES из pricelist.ts
 *
 * В реальном приложении цены загружаются из Supabase через API.
 * Эти данные используются только как fallback когда БД недоступна.
 */

/**
 * Генерация mock цен для модели на основе категории
 * Использует актуальные service slug из 002_seed_data.sql
 */
function generatePricesForModel(modelId: string, category: 'iphone' | 'ipad' | 'macbook' | 'apple-watch'): ServicePrice[] {
  const basePrices: Record<string, number> = {
    // iPhone services (из БД 002_seed_data.sql)
    'iphone-display-original-prc': 6470,
    'iphone-display-analog': 5470,
    'iphone-battery': 2070,
    'iphone-back-glass': 3270,
    'iphone-housing': 4270,
    'iphone-camera-main': 3870,
    'iphone-charging-cable': 2270,
    'iphone-water-damage': 2000,

    // iPad services
    'ipad-glass': 4500,
    'ipad-digitizer': 5500,
    'ipad-display-original': 7000,
    'ipad-battery': 2500,
    'ipad-water-damage': 2500,
    'ipad-charging-port': 2000,

    // MacBook services
    'macbook-display': 12000,
    'macbook-battery': 4500,
    'macbook-keyboard': 6000,
    'macbook-thermal-paste': 1500,

    // Apple Watch services
    'watch-glass': 1800,
    'watch-digitizer': 2200,
    'watch-display': 3500,
    'watch-battery': 1500,
    'watch-nfc': 2000,
  };

  const categoryServices: Record<string, string[]> = {
    'iphone': ['iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery', 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main', 'iphone-charging-cable', 'iphone-water-damage'],
    'ipad': ['ipad-glass', 'ipad-digitizer', 'ipad-display-original', 'ipad-battery', 'ipad-water-damage', 'ipad-charging-port'],
    'macbook': ['macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-thermal-paste'],
    'apple-watch': ['watch-glass', 'watch-digitizer', 'watch-display', 'watch-battery', 'watch-nfc'],
  };

  const services = categoryServices[category] || [];

  return services.map(slug => ({
    serviceId: slug, // Используем slug как ID для mock данных
    modelId,
    price: basePrices[slug],
    price_type: slug.includes('water-damage') ? 'from' as const : 'fixed' as const,
    currency: 'CZK' as const,
    duration: 60,
    warranty_months: 24,
    is_active: true,
  }));
}

// Mock цены - генерируются динамически для каждой модели при запросе

/**
 * Получить модели для категории
 */
export function getModelsForCategory(category: string): DeviceModel[] {
  return MOCK_MODELS.filter(m => m.category === category);
}

/**
 * Получить модель по slug
 */
export function getModelBySlug(slug: string): DeviceModel | undefined {
  return MOCK_MODELS.find(m => m.slug === slug);
}

/**
 * Получить цены для модели
 * Генерирует mock цены динамически на основе категории модели
 */
export function getPricesForModel(modelId: string): ServicePrice[] {
  const model = MOCK_MODELS.find(m => m.id === modelId);
  if (!model) {
    return [];
  }
  return generatePricesForModel(modelId, model.category);
}
