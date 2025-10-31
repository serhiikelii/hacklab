/**
 * Mock данные для демонстрации прайс-листа
 * В продакшене будут заменены на реальные данные из Supabase
 */

import type { DeviceModel, Service, ServicePrice } from '@/types/pricelist';

// Mock модели устройств
export const MOCK_MODELS: DeviceModel[] = [
  // iPhone (40 моделей)
  { id: '1', slug: 'iphone-16-pro-max', category: 'iphone', name: 'iPhone 16 Pro Max', series: 'iPhone 16', releaseYear: 2024, isPopular: true },
  { id: '2', slug: 'iphone-16-pro', category: 'iphone', name: 'iPhone 16 Pro', series: 'iPhone 16', releaseYear: 2024, isPopular: true },
  { id: '3', slug: 'iphone-16-plus', category: 'iphone', name: 'iPhone 16 Plus', series: 'iPhone 16', releaseYear: 2024, isPopular: true },
  { id: '4', slug: 'iphone-16', category: 'iphone', name: 'iPhone 16', series: 'iPhone 16', releaseYear: 2024, isPopular: true },
  { id: '5', slug: 'iphone-15-pro-max', category: 'iphone', name: 'iPhone 15 Pro Max', series: 'iPhone 15', releaseYear: 2023, isPopular: true },
  { id: '6', slug: 'iphone-15-pro', category: 'iphone', name: 'iPhone 15 Pro', series: 'iPhone 15', releaseYear: 2023, isPopular: true },
  { id: '7', slug: 'iphone-15-plus', category: 'iphone', name: 'iPhone 15 Plus', series: 'iPhone 15', releaseYear: 2023 },
  { id: '8', slug: 'iphone-15', category: 'iphone', name: 'iPhone 15', series: 'iPhone 15', releaseYear: 2023 },
  { id: '9', slug: 'iphone-14-pro-max', category: 'iphone', name: 'iPhone 14 Pro Max', series: 'iPhone 14', releaseYear: 2022 },
  { id: '10', slug: 'iphone-14-pro', category: 'iphone', name: 'iPhone 14 Pro', series: 'iPhone 14', releaseYear: 2022 },
  { id: '11', slug: 'iphone-14-plus', category: 'iphone', name: 'iPhone 14 Plus', series: 'iPhone 14', releaseYear: 2022 },
  { id: '12', slug: 'iphone-14', category: 'iphone', name: 'iPhone 14', series: 'iPhone 14', releaseYear: 2022 },

  // iPad (24 моделей)
  { id: '41', slug: 'ipad-pro-12-9-2024', category: 'ipad', name: 'iPad Pro 12.9" (2024)', series: 'iPad Pro', releaseYear: 2024, isPopular: true },
  { id: '42', slug: 'ipad-pro-11-2024', category: 'ipad', name: 'iPad Pro 11" (2024)', series: 'iPad Pro', releaseYear: 2024, isPopular: true },
  { id: '43', slug: 'ipad-air-5', category: 'ipad', name: 'iPad Air 5', series: 'iPad Air', releaseYear: 2022, isPopular: true },
  { id: '44', slug: 'ipad-air-4', category: 'ipad', name: 'iPad Air 4', series: 'iPad Air', releaseYear: 2020 },
  { id: '45', slug: 'ipad-mini-6', category: 'ipad', name: 'iPad mini 6', series: 'iPad mini', releaseYear: 2021 },
  { id: '46', slug: 'ipad-10', category: 'ipad', name: 'iPad 10', series: 'iPad', releaseYear: 2022 },

  // Mac (32 модели)
  // Row 1
  { id: '65', slug: 'macbook-pro-16-m4-a3403', category: 'mac', name: 'MacBook Pro 16" M4 (A3403)', series: 'MacBook Pro M4', releaseYear: 2024, isPopular: true },
  { id: '66', slug: 'macbook-pro-14-m4-a3401', category: 'mac', name: 'MacBook Pro 14" M4 (A3401)', series: 'MacBook Pro M4', releaseYear: 2024, isPopular: true },
  { id: '67', slug: 'macbook-pro-14-m4-a3112', category: 'mac', name: 'MacBook Pro 14" M4 (A3112)', series: 'MacBook Pro M4', releaseYear: 2024, isPopular: true },
  { id: '68', slug: 'macbook-air-15-m3-a3114', category: 'mac', name: 'MacBook Air 15" M3 (A3114)', series: 'MacBook Air M3', releaseYear: 2024, isPopular: true },
  // Row 2
  { id: '69', slug: 'macbook-pro-16-a2991', category: 'mac', name: 'MacBook Pro 16" (A2991)', series: 'MacBook Pro', releaseYear: 2023 },
  { id: '70', slug: 'macbook-pro-16-a2780', category: 'mac', name: 'MacBook Pro 16" (A2780)', series: 'MacBook Pro', releaseYear: 2023 },
  { id: '71', slug: 'macbook-pro-16-m1-a2485', category: 'mac', name: 'MacBook Pro 16" M1 (A2485)', series: 'MacBook Pro M1', releaseYear: 2021 },
  { id: '72', slug: 'macbook-pro-16-a2141', category: 'mac', name: 'MacBook Pro 16" (A2141)', series: 'MacBook Pro', releaseYear: 2019 },
  // Row 3
  { id: '73', slug: 'macbook-pro-15-a1990', category: 'mac', name: 'MacBook Pro 15" (A1990)', series: 'MacBook Pro', releaseYear: 2018 },
  { id: '74', slug: 'macbook-pro-15-a1707', category: 'mac', name: 'MacBook Pro 15" (A1707)', series: 'MacBook Pro', releaseYear: 2016 },
  { id: '75', slug: 'macbook-pro-15-a1398', category: 'mac', name: 'MacBook Pro 15" (A1398)', series: 'MacBook Pro', releaseYear: 2015 },
  { id: '76', slug: 'macbook-pro-14-m3-a2992', category: 'mac', name: 'MacBook Pro 14" M3 (A2992)', series: 'MacBook Pro M3', releaseYear: 2023 },
  // Row 4
  { id: '77', slug: 'macbook-pro-14-m3-a2918', category: 'mac', name: 'MacBook Pro 14" M3 (A2918)', series: 'MacBook Pro M3', releaseYear: 2023 },
  { id: '78', slug: 'macbook-pro-14-m2-a2779', category: 'mac', name: 'MacBook Pro 14" M2 (A2779)', series: 'MacBook Pro M2', releaseYear: 2023 },
  { id: '79', slug: 'macbook-pro-14-m1-a2442', category: 'mac', name: 'MacBook Pro 14" M1 (A2442)', series: 'MacBook Pro M1', releaseYear: 2021 },
  { id: '80', slug: 'macbook-pro-13-m1-m2-a2338', category: 'mac', name: 'MacBook Pro 13" M1/M2 (A2338)', series: 'MacBook Pro', releaseYear: 2022 },
  // Row 5
  { id: '81', slug: 'macbook-pro-13-a2251-a2289', category: 'mac', name: 'MacBook Pro 13" (A2251,A2289)', series: 'MacBook Pro', releaseYear: 2020 },
  { id: '82', slug: 'macbook-pro-13-a2159', category: 'mac', name: 'MacBook Pro 13" (A2159)', series: 'MacBook Pro', releaseYear: 2019 },
  { id: '83', slug: 'macbook-pro-13-a1989', category: 'mac', name: 'MacBook Pro 13" (A1989)', series: 'MacBook Pro', releaseYear: 2018 },
  { id: '84', slug: 'macbook-pro-13-a1706-a1708', category: 'mac', name: 'MacBook Pro 13" (A1706,A1708)', series: 'MacBook Pro', releaseYear: 2017 },
  // Row 6
  { id: '85', slug: 'macbook-pro-13-a1425-a1502', category: 'mac', name: 'MacBook Pro 13" (A1425,A1502)', series: 'MacBook Pro', releaseYear: 2015 },
  { id: '86', slug: 'macbook-air-15-a2941', category: 'mac', name: 'MacBook Air 15" (A2941)', series: 'MacBook Air', releaseYear: 2023 },
  { id: '87', slug: 'macbook-air-13-m3-a3113', category: 'mac', name: 'MacBook Air 13" M3 (A3113)', series: 'MacBook Air M3', releaseYear: 2024 },
  { id: '88', slug: 'macbook-air-13-a2337', category: 'mac', name: 'MacBook Air 13" (A2179)', series: 'MacBook Air', releaseYear: 2020 },
  // Row 7
  { id: '89', slug: 'macbook-air-13-m1-a2337', category: 'mac', name: 'MacBook Air 13" M1 (A2337)', series: 'MacBook Air M1', releaseYear: 2020 },
  { id: '90', slug: 'macbook-air-13-a2179-2', category: 'mac', name: 'MacBook Air 13" (A2179)', series: 'MacBook Air', releaseYear: 2020 },
  { id: '91', slug: 'macbook-air-13-a1932', category: 'mac', name: 'MacBook Air 13" (A1932)', series: 'MacBook Air', releaseYear: 2018 },
  { id: '92', slug: 'macbook-air-11-a1370-a1465', category: 'mac', name: 'MacBook Air 11" (A1370,A1465)', series: 'MacBook Air', releaseYear: 2015 },
  // Row 8
  { id: '93', slug: 'macbook-12-a1534', category: 'mac', name: 'MacBook 12" (A1534)', series: 'MacBook', releaseYear: 2017 },

  // Watch (17 моделей)
  // Row 1
  { id: '101', slug: 'apple-watch-ultra-49mm', category: 'watch', name: 'Apple Watch Ultra 49mm', series: 'Apple Watch Ultra', releaseYear: 2022, isPopular: true },
  { id: '102', slug: 'apple-watch-se-2-44mm', category: 'watch', name: 'Apple Watch SE 2 44mm', series: 'Apple Watch SE 2', releaseYear: 2022, isPopular: true },
  { id: '103', slug: 'apple-watch-se-2-40mm', category: 'watch', name: 'Apple Watch SE 2 40mm', series: 'Apple Watch SE 2', releaseYear: 2022, isPopular: true },
  { id: '104', slug: 'apple-watch-se-44mm', category: 'watch', name: 'Apple Watch SE 44mm', series: 'Apple Watch SE', releaseYear: 2020, isPopular: true },
  // Row 2
  { id: '105', slug: 'apple-watch-se-40mm', category: 'watch', name: 'Apple Watch SE 40mm', series: 'Apple Watch SE', releaseYear: 2020 },
  { id: '106', slug: 'apple-watch-series-8-45mm', category: 'watch', name: 'Apple Watch Series 8 45mm', series: 'Apple Watch Series 8', releaseYear: 2022 },
  { id: '107', slug: 'apple-watch-series-8-41mm', category: 'watch', name: 'Apple Watch Series 8 41mm', series: 'Apple Watch Series 8', releaseYear: 2022 },
  { id: '108', slug: 'apple-watch-series-7-45mm', category: 'watch', name: 'Apple Watch Series 7 45mm', series: 'Apple Watch Series 7', releaseYear: 2021 },
  // Row 3
  { id: '109', slug: 'apple-watch-series-7-41mm', category: 'watch', name: 'Apple Watch Series 7 41mm', series: 'Apple Watch Series 7', releaseYear: 2021 },
  { id: '110', slug: 'apple-watch-series-6-44mm', category: 'watch', name: 'Apple Watch Series 6 44mm', series: 'Apple Watch Series 6', releaseYear: 2020 },
  { id: '111', slug: 'apple-watch-series-6-40mm', category: 'watch', name: 'Apple Watch Series 6 40mm', series: 'Apple Watch Series 6', releaseYear: 2020 },
  { id: '112', slug: 'apple-watch-series-5-44mm', category: 'watch', name: 'Apple Watch Series 5 44mm', series: 'Apple Watch Series 5', releaseYear: 2019 },
  // Row 4
  { id: '113', slug: 'apple-watch-series-5-40mm', category: 'watch', name: 'Apple Watch Series 5 40mm', series: 'Apple Watch Series 5', releaseYear: 2019 },
  { id: '114', slug: 'apple-watch-series-4-44mm', category: 'watch', name: 'Apple Watch Series 4 44mm', series: 'Apple Watch Series 4', releaseYear: 2018 },
  { id: '115', slug: 'apple-watch-series-4-40mm', category: 'watch', name: 'Apple Watch Series 4 40mm', series: 'Apple Watch Series 4', releaseYear: 2018 },
  { id: '116', slug: 'apple-watch-series-3-42mm', category: 'watch', name: 'Apple Watch Series 3 42mm', series: 'Apple Watch Series 3', releaseYear: 2017 },
  // Row 5
  { id: '117', slug: 'apple-watch-series-3-38mm', category: 'watch', name: 'Apple Watch Series 3 38mm', series: 'Apple Watch Series 3', releaseYear: 2017 },
];

// Mock услуги (используем константы из types/pricelist.ts)
// В реальном приложении будут загружаться из Supabase

// Mock цены для демонстрации
// Генерируем цены для всех популярных моделей
export const MOCK_PRICES: ServicePrice[] = [];

// Функция для генерации цен для модели
function generatePricesForModel(modelId: string, basePriceMultiplier: number = 1) {
  return [
    // Основные услуги
    { serviceId: '1', modelId, currency: 'CZK' as const, duration: 15 }, // Diagnostics - FREE
    { serviceId: '2', modelId, price: Math.round(6470 * basePriceMultiplier), currency: 'CZK' as const, duration: 60, warranty: 24 }, // Broken glass
    { serviceId: '3', modelId, price: Math.round(7170 * basePriceMultiplier), currency: 'CZK' as const, duration: 60, warranty: 24 }, // Front panel
    { serviceId: '4', modelId, price: Math.round(2070 * basePriceMultiplier), currency: 'CZK' as const, duration: 30, warranty: 24 }, // Battery
    { serviceId: '5', modelId, price: Math.round(3270 * basePriceMultiplier), currency: 'CZK' as const, duration: 45, warranty: 24 }, // Rear glass
    { serviceId: '6', modelId, price: Math.round(2570 * basePriceMultiplier), currency: 'CZK' as const, duration: 45, warranty: 24 }, // Power button
    { serviceId: '7', modelId, price: Math.round(2570 * basePriceMultiplier), currency: 'CZK' as const, duration: 45, warranty: 24 }, // Volume buttons
    { serviceId: '8', modelId, price: Math.round(2370 * basePriceMultiplier), currency: 'CZK' as const, duration: 40, warranty: 24 }, // Volume switch
    { serviceId: '9', modelId, price: Math.round(2270 * basePriceMultiplier), currency: 'CZK' as const, duration: 40, warranty: 24 }, // Power connector
    { serviceId: '10', modelId, price: Math.round(1970 * basePriceMultiplier), currency: 'CZK' as const, duration: 35, warranty: 24 }, // Microphone
    { serviceId: '11', modelId, price: Math.round(1970 * basePriceMultiplier), currency: 'CZK' as const, duration: 35, warranty: 24 }, // Loudspeaker
    { serviceId: '12', modelId, price: Math.round(2170 * basePriceMultiplier), currency: 'CZK' as const, duration: 40, warranty: 24 }, // Ear speaker
    { serviceId: '13', modelId, price: Math.round(3870 * basePriceMultiplier), currency: 'CZK' as const, duration: 45, warranty: 24 }, // Rear camera
    { serviceId: '14', modelId, price: Math.round(1470 * basePriceMultiplier), currency: 'CZK' as const, duration: 30, warranty: 24 }, // Camera glass
    { serviceId: '15', modelId, price: Math.round(2670 * basePriceMultiplier), currency: 'CZK' as const, duration: 40, warranty: 24 }, // Front camera
    { serviceId: '16', modelId, price: Math.round(1500 * basePriceMultiplier), currency: 'CZK' as const, duration: 60, warranty: 24 }, // Frame straightening
    { serviceId: '17', modelId, price: Math.round(2000 * basePriceMultiplier), currency: 'CZK' as const, duration: 90, warranty: 24 }, // Liquid damage
    { serviceId: '18', modelId, currency: 'CZK' as const }, // Motherboard repair - on request
    { serviceId: '19', modelId, price: Math.round(500 * basePriceMultiplier), currency: 'CZK' as const, duration: 30, warranty: 24 }, // Software
    
    // Дополнительные услуги
    { serviceId: '20', modelId, price: 70, currency: 'CZK' as const, duration: 10, warranty: 6 }, // Glass installation
    { serviceId: '21', modelId, price: 120, currency: 'CZK' as const, duration: 15, warranty: 6 }, // Whole body glass
    { serviceId: '22', modelId, price: 270, currency: 'CZK' as const, duration: 20, warranty: 12 }, // Mechanical cleaning
    { serviceId: '23', modelId, currency: 'CZK' as const, duration: 10 }, // Service report - FREE
    { serviceId: '24', modelId, currency: 'CZK' as const, duration: 5 }, // SIM cutting - FREE
  ];
}

// Генерируем цены для всех iPhone моделей
MOCK_PRICES.push(...generatePricesForModel('1', 1.0));  // iPhone 16 Pro Max
MOCK_PRICES.push(...generatePricesForModel('2', 1.0));  // iPhone 16 Pro
MOCK_PRICES.push(...generatePricesForModel('3', 0.95)); // iPhone 16 Plus
MOCK_PRICES.push(...generatePricesForModel('4', 0.95)); // iPhone 16
MOCK_PRICES.push(...generatePricesForModel('5', 0.95)); // iPhone 15 Pro Max
MOCK_PRICES.push(...generatePricesForModel('6', 0.95)); // iPhone 15 Pro
MOCK_PRICES.push(...generatePricesForModel('7', 0.85)); // iPhone 15 Plus
MOCK_PRICES.push(...generatePricesForModel('8', 0.85)); // iPhone 15
MOCK_PRICES.push(...generatePricesForModel('9', 0.80)); // iPhone 14 Pro Max
MOCK_PRICES.push(...generatePricesForModel('10', 0.80)); // iPhone 14 Pro
MOCK_PRICES.push(...generatePricesForModel('11', 0.75)); // iPhone 14 Plus
MOCK_PRICES.push(...generatePricesForModel('12', 0.75)); // iPhone 14

// Генерируем цены для iPad моделей
MOCK_PRICES.push(...generatePricesForModel('41', 0.85)); // iPad Pro 12.9"
MOCK_PRICES.push(...generatePricesForModel('42', 0.80)); // iPad Pro 11"
MOCK_PRICES.push(...generatePricesForModel('43', 0.70)); // iPad Air 5
MOCK_PRICES.push(...generatePricesForModel('44', 0.65)); // iPad Air 4
MOCK_PRICES.push(...generatePricesForModel('45', 0.60)); // iPad mini 6
MOCK_PRICES.push(...generatePricesForModel('46', 0.55)); // iPad 10

// Генерируем цены для Mac моделей (примерные, для Mac другие услуги)
MOCK_PRICES.push(...generatePricesForModel('65', 1.5)); // MacBook Pro 16" M4 (A3403)
MOCK_PRICES.push(...generatePricesForModel('66', 1.4)); // MacBook Pro 14" M4 (A3401)
MOCK_PRICES.push(...generatePricesForModel('67', 1.3)); // MacBook Pro 14" M4 (A3112)
MOCK_PRICES.push(...generatePricesForModel('68', 1.2)); // MacBook Air 15" M3 (A3114)
MOCK_PRICES.push(...generatePricesForModel('69', 1.4)); // MacBook Pro 16" (A2991)
MOCK_PRICES.push(...generatePricesForModel('70', 1.3)); // MacBook Pro 16" (A2780)
MOCK_PRICES.push(...generatePricesForModel('71', 1.2)); // MacBook Pro 16" M1 (A2485)
MOCK_PRICES.push(...generatePricesForModel('72', 1.1)); // MacBook Pro 16" (A2141)
MOCK_PRICES.push(...generatePricesForModel('73', 1.0)); // MacBook Pro 15" (A1990)
MOCK_PRICES.push(...generatePricesForModel('74', 0.95)); // MacBook Pro 15" (A1707)
MOCK_PRICES.push(...generatePricesForModel('75', 0.90)); // MacBook Pro 15" (A1398)
MOCK_PRICES.push(...generatePricesForModel('76', 1.3)); // MacBook Pro 14" M3 (A2992)
MOCK_PRICES.push(...generatePricesForModel('77', 1.2)); // MacBook Pro 14" M3 (A2918)
MOCK_PRICES.push(...generatePricesForModel('78', 1.1)); // MacBook Pro 14" M2 (A2779)
MOCK_PRICES.push(...generatePricesForModel('79', 1.0)); // MacBook Pro 14" M1 (A2442)
MOCK_PRICES.push(...generatePricesForModel('80', 0.95)); // MacBook Pro 13" M1/M2 (A2338)
MOCK_PRICES.push(...generatePricesForModel('81', 0.90)); // MacBook Pro 13" (A2251,A2289)
MOCK_PRICES.push(...generatePricesForModel('82', 0.85)); // MacBook Pro 13" (A2159)
MOCK_PRICES.push(...generatePricesForModel('83', 0.80)); // MacBook Pro 13" (A1989)
MOCK_PRICES.push(...generatePricesForModel('84', 0.75)); // MacBook Pro 13" (A1706,A1708)
MOCK_PRICES.push(...generatePricesForModel('85', 0.70)); // MacBook Pro 13" (A1425,A1502)
MOCK_PRICES.push(...generatePricesForModel('86', 1.1)); // MacBook Air 15" (A2941)
MOCK_PRICES.push(...generatePricesForModel('87', 1.0)); // MacBook Air 13" M3 (A3113)
MOCK_PRICES.push(...generatePricesForModel('88', 0.90)); // MacBook Air 13" (A2179)
MOCK_PRICES.push(...generatePricesForModel('89', 0.95)); // MacBook Air 13" M1 (A2337)
MOCK_PRICES.push(...generatePricesForModel('90', 0.90)); // MacBook Air 13" (A2179)
MOCK_PRICES.push(...generatePricesForModel('91', 0.85)); // MacBook Air 13" (A1932)
MOCK_PRICES.push(...generatePricesForModel('92', 0.75)); // MacBook Air 11" (A1370,A1465)
MOCK_PRICES.push(...generatePricesForModel('93', 0.80)); // MacBook 12" (A1534)

// Генерируем цены для Watch моделей (17 моделей)
MOCK_PRICES.push(...generatePricesForModel('101', 0.55)); // Apple Watch Ultra 49mm
MOCK_PRICES.push(...generatePricesForModel('102', 0.48)); // Apple Watch SE 2 44mm
MOCK_PRICES.push(...generatePricesForModel('103', 0.45)); // Apple Watch SE 2 40mm
MOCK_PRICES.push(...generatePricesForModel('104', 0.42)); // Apple Watch SE 44mm
MOCK_PRICES.push(...generatePricesForModel('105', 0.40)); // Apple Watch SE 40mm
MOCK_PRICES.push(...generatePricesForModel('106', 0.48)); // Apple Watch Series 8 45mm
MOCK_PRICES.push(...generatePricesForModel('107', 0.45)); // Apple Watch Series 8 41mm
MOCK_PRICES.push(...generatePricesForModel('108', 0.45)); // Apple Watch Series 7 45mm
MOCK_PRICES.push(...generatePricesForModel('109', 0.42)); // Apple Watch Series 7 41mm
MOCK_PRICES.push(...generatePricesForModel('110', 0.42)); // Apple Watch Series 6 44mm
MOCK_PRICES.push(...generatePricesForModel('111', 0.40)); // Apple Watch Series 6 40mm
MOCK_PRICES.push(...generatePricesForModel('112', 0.40)); // Apple Watch Series 5 44mm
MOCK_PRICES.push(...generatePricesForModel('113', 0.38)); // Apple Watch Series 5 40mm
MOCK_PRICES.push(...generatePricesForModel('114', 0.38)); // Apple Watch Series 4 44mm
MOCK_PRICES.push(...generatePricesForModel('115', 0.35)); // Apple Watch Series 4 40mm
MOCK_PRICES.push(...generatePricesForModel('116', 0.35)); // Apple Watch Series 3 42mm
MOCK_PRICES.push(...generatePricesForModel('117', 0.32)); // Apple Watch Series 3 38mm

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
 */
export function getPricesForModel(modelId: string): ServicePrice[] {
  return MOCK_PRICES.filter(p => p.modelId === modelId);
}
