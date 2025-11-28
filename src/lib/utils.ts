import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Парсит название модели для iPad/MacBook
 * Извлекает модельные коды из названия для отдельного отображения
 *
 * @param name - Полное название модели (например, "iPad 6 (2018) (A1893,A1954)")
 * @param category - Категория устройства
 * @returns Объект с основным названием и опциональными модельными кодами
 *
 * @example
 * parseModelName("iPad 6 (2018) (A1893,A1954)", "ipad")
 * // => { mainName: "iPad 6 (2018)", modelCodes: "(A1893,A1954)" }
 *
 * parseModelName("iPhone 16 Pro", "iphone")
 * // => { mainName: "iPhone 16 Pro" }
 */
export function parseModelName(
  name: string,
  category: string
): { mainName: string; modelCodes?: string } {
  // Парсим только для iPad и MacBook
  if (category !== 'ipad' && category !== 'macbook') {
    return { mainName: name };
  }

  // Регулярка для поиска модельных кодов в скобках в конце строки
  // Ищем паттерн: (A1234, A5678) или (A1234,A5678) в конце строки
  const modelCodesRegex = /\s*(\([A-Z]\d{4}[,\s]*(?:[A-Z]\d{4}[,\s]*)*\))$/;
  const match = name.match(modelCodesRegex);

  if (match) {
    const modelCodes = match[1].trim();
    const mainName = name.replace(modelCodesRegex, '').trim();
    return { mainName, modelCodes };
  }

  return { mainName: name };
}

/**
 * Форматирует время ремонта из минут в читаемый формат
 *
 * @param minutes - Время в минутах из БД
 * @returns Отформатированная строка времени
 *
 * @example
 * formatDuration(30)    // => "30 min"
 * formatDuration(60)    // => "1h"
 * formatDuration(90)    // => "1-2h"
 * formatDuration(1440)  // => "1d"
 * formatDuration(2880)  // => "2-3d"
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) {
    return '-';
  }

  // Меньше часа - показываем минуты
  if (minutes < 60) {
    return `${minutes} min`;
  }

  // От 1 до 24 часов - показываем часы
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Если точное количество часов без остатка
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    // Если есть остаток - показываем диапазон
    return `${hours}-${hours + 1}h`;
  }

  // 24 часа и больше - показываем дни
  const days = Math.floor(minutes / 1440);
  const remainingHours = (minutes % 1440) / 60;

  // Если точное количество дней без остатка
  if (remainingHours === 0) {
    return `${days}d`;
  }

  // Если есть остаток - показываем диапазон
  return `${days}-${days + 1}d`;
}
