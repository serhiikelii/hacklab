import { describe, it, expect } from 'vitest'
import { cn, parseModelName, formatDuration } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBe('py-1 px-4')
    })

    it('should handle conditional classes', () => {
      const result = cn('base-class', false && 'hidden', 'visible')
      expect(result).toBe('base-class visible')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })

  describe('parseModelName', () => {
    it('should parse iPad model with codes', () => {
      const result = parseModelName('iPad 6 (2018) (A1893,A1954)', 'ipad')
      expect(result).toEqual({
        mainName: 'iPad 6 (2018)',
        modelCodes: '(A1893,A1954)'
      })
    })

    it('should parse MacBook model with codes', () => {
      const result = parseModelName('MacBook Air 13 (A1932, A2179)', 'macbook')
      expect(result).toEqual({
        mainName: 'MacBook Air 13',
        modelCodes: '(A1932, A2179)'
      })
    })

    it('should not parse iPhone model', () => {
      const result = parseModelName('iPhone 16 Pro', 'iphone')
      expect(result).toEqual({
        mainName: 'iPhone 16 Pro'
      })
    })

    it('should handle model without codes', () => {
      const result = parseModelName('iPad Pro 11', 'ipad')
      expect(result).toEqual({
        mainName: 'iPad Pro 11'
      })
    })

    it('should handle empty category', () => {
      const result = parseModelName('Some Device (A1234)', 'other')
      expect(result).toEqual({
        mainName: 'Some Device (A1234)'
      })
    })
  })

  describe('formatDuration', () => {
    it('should format minutes under an hour', () => {
      expect(formatDuration(30)).toBe('30 min')
      expect(formatDuration(45)).toBe('45 min')
      expect(formatDuration(1)).toBe('1 min')
    })

    it('should format exact hours', () => {
      expect(formatDuration(60)).toBe('1h')
      expect(formatDuration(120)).toBe('2h')
      expect(formatDuration(180)).toBe('3h')
    })

    it('should format hour ranges', () => {
      expect(formatDuration(90)).toBe('1-2h')
      expect(formatDuration(150)).toBe('2-3h')
    })

    it('should format exact days', () => {
      expect(formatDuration(1440)).toBe('1d')
      expect(formatDuration(2880)).toBe('2d')
    })

    it('should format day ranges', () => {
      expect(formatDuration(1500)).toBe('1-2d')
      expect(formatDuration(3000)).toBe('2-3d')
    })

    it('should handle null and undefined', () => {
      expect(formatDuration(null)).toBe('-')
      expect(formatDuration(undefined)).toBe('-')
    })

    it('should handle zero and negative values', () => {
      expect(formatDuration(0)).toBe('-')
      expect(formatDuration(-10)).toBe('-')
    })
  })
})
