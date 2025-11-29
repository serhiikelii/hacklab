import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses model name for iPad/MacBook
 * Extracts model codes from name for separate display
 *
 * @param name - Full model name (e.g., "iPad 6 (2018) (A1893,A1954)")
 * @param category - Device category
 * @returns Object with main name and optional model codes
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
  // Parse only for iPad and MacBook
  if (category !== 'ipad' && category !== 'macbook') {
    return { mainName: name };
  }

  // Regex to find model codes in brackets at end of string
  // Search for pattern: (A1234, A5678) or (A1234,A5678) at end of line
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
 * Formats repair time from minutes to readable format
 *
 * @param minutes - Time in minutes from DB
 * @returns Formatted time string
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

  // Less than hour - show minutes
  if (minutes < 60) {
    return `${minutes} min`;
  }

  // From 1 to 24 hours - show hours
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // If exact hours without remainder
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    // If there's remainder - show range
    return `${hours}-${hours + 1}h`;
  }

  // 24 hours and more - show days
  const days = Math.floor(minutes / 1440);
  const remainingHours = (minutes % 1440) / 60;

  // If exact days without remainder
  if (remainingHours === 0) {
    return `${days}d`;
  }

  // If there's remainder - show range
  return `${days}-${days + 1}d`;
}
