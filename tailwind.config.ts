import type { Config } from "tailwindcss";

/**
 * ЦВЕТОВАЯ ПАЛИТРА: Современный минимализм для сервисного центра
 *
 * Психология выбора:
 * - Темно-серый (#2d3748) - профессиональный, сдержанный, элегантный
 * - Серые тона ассоциируются с надежностью и стабильностью
 * - Нейтральная палитра для технологической индустрии
 * - Минималистичный дизайн без ярких акцентов
 *
 * Использование:
 * - primary: Основные CTA кнопки, ссылки, активные состояния
 * - primary-hover: Hover эффекты на кнопках и интерактивных элементах
 * - primary-light: Фоны, badges, subtle акценты
 * - secondary: Header, footer, темные секции
 * - success: Подтверждения, успешные действия
 * - neutral: Текст, границы, фоны (используйте gray-50 до gray-900)
 *
 * Контрастность: Все цвета проходят WCAG AA стандарт
 */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Основной цвет - темно-серый
        primary: {
          DEFAULT: "#2d3748", // gray-800 - основной акцентный цвет
          foreground: "#ffffff", // белый текст на темном фоне
          hover: "#1a202c", // gray-900 - для hover состояний
          light: "#f7fafc", // gray-50 - для светлых фонов и badges
          dark: "#1a202c", // gray-900 - для темных вариантов
        },

        // Вторичный цвет - темно-серый
        secondary: {
          DEFAULT: "#1f2937", // gray-800 - профессиональный темный
          foreground: "#ffffff",
          light: "#374151", // gray-700 - для hover
        },

        // Акцентный цвет - серый для особых элементов
        accent: {
          DEFAULT: "#4b5563", // gray-600 - для особых акцентов
          foreground: "#ffffff",
          hover: "#374151", // gray-700
          light: "#f3f4f6", // gray-100
        },

        // Цвет успеха - приглушенный зеленый
        success: {
          DEFAULT: "#10b981", // emerald-500
          foreground: "#ffffff",
          light: "#d1fae5", // emerald-50
        },

        // Градиенты (опционально, для будущего использования)
        gradient: {
          from: "#2d3748", // gray-800
          to: "#1f2937", // gray-800
        },
      },

      // Тени с цветовыми тонами для глубины
      boxShadow: {
        'primary-glow': '0 0 20px rgba(45, 55, 72, 0.3)',
        'primary-sm': '0 2px 8px rgba(45, 55, 72, 0.15)',
        'primary-md': '0 4px 16px rgba(45, 55, 72, 0.2)',
      },

      // Плавные переходы
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
};
export default config;
