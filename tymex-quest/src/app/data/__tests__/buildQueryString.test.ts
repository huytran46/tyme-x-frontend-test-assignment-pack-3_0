// Mock nuqs server imports to avoid ESM issues
jest.mock('nuqs/server', () => ({
  createLoader: jest.fn(),
  parseAsArrayOf: jest.fn(),
  parseAsFloat: { withDefault: jest.fn() },
  parseAsInteger: { withDefault: jest.fn() },
  parseAsString: { withDefault: jest.fn() },
  parseAsStringLiteral: jest.fn(),
}))

import { buildQueryString, type ProductQueryParams } from '@/app/data'

describe('buildQueryString', () => {
  // Helper to create base params
  const createParams = (overrides: Partial<ProductQueryParams> = {}): ProductQueryParams => ({
    q: '',
    price_gte: null,
    price_lte: null,
    tier: null,
    theme: null,
    category: [],
    _sort: null,
    _order: null,
    _page: 1,
    _limit: 8,
    ...overrides,
  })

  describe('category handling', () => {
    it('should handle empty category array', () => {
      const params = createParams({ category: [] })
      const result = buildQueryString(params)
      expect(result).not.toContain('category')
    })

    it('should handle single category', () => {
      const params = createParams({ category: ['Upper Body'] })
      const result = buildQueryString(params)
      expect(result).toContain('category=Upper+Body')
    })

    it('should handle multiple categories', () => {
      const params = createParams({ category: ['Upper Body', 'Legendary', 'Hat'] })
      const result = buildQueryString(params)
      expect(result).toContain('category=Upper+Body')
      expect(result).toContain('category=Legendary')
      expect(result).toContain('category=Hat')
    })

    it('should encode category names with special characters', () => {
      const params = createParams({ category: ['Upper & Body', 'Test/Category'] })
      const result = buildQueryString(params)
      expect(result).toContain('category=Upper+%26+Body')
      expect(result).toContain('category=Test%2FCategory')
    })
  })

  describe('basic parameter handling', () => {
    it('should handle search query', () => {
      const params = createParams({ q: 'test search' })
      const result = buildQueryString(params)
      expect(result).toContain('q=test+search')
    })

    it('should handle price range parameters', () => {
      const params = createParams({ price_gte: 10.5, price_lte: 100 })
      const result = buildQueryString(params)
      expect(result).toContain('price_gte=10.5')
      expect(result).toContain('price_lte=100')
    })

    it('should handle tier and theme', () => {
      const params = createParams({ tier: 'Epic', theme: 'Dark' })
      const result = buildQueryString(params)
      expect(result).toContain('tier=Epic')
      expect(result).toContain('theme=Dark')
    })

    it('should handle sorting parameters', () => {
      const params = createParams({ _sort: 'price', _order: 'desc' })
      const result = buildQueryString(params)
      expect(result).toContain('_sort=price')
      expect(result).toContain('_order=desc')
    })

    it('should handle pagination parameters', () => {
      const params = createParams({ _page: 3, _limit: 12 })
      const result = buildQueryString(params)
      expect(result).toContain('_page=3')
      expect(result).toContain('_limit=12')
    })
  })

  describe('edge cases', () => {
    it('should skip null and undefined values', () => {
      const params = createParams({
        price_gte: null,
        price_lte: undefined,
        tier: null,
        theme: null,
      })
      const result = buildQueryString(params)
      expect(result).not.toContain('price_gte')
      expect(result).not.toContain('price_lte')
      expect(result).not.toContain('tier')
      expect(result).not.toContain('theme')
    })

    it('should skip empty strings', () => {
      const params = createParams({ q: '', tier: '', theme: '' })
      const result = buildQueryString(params)
      expect(result).not.toContain('q=')
      expect(result).not.toContain('tier=')
      expect(result).not.toContain('theme=')
    })

    it('should handle zero values', () => {
      const params = createParams({ price_gte: 0, _page: 0 })
      const result = buildQueryString(params)
      expect(result).toContain('price_gte=0')
      expect(result).toContain('_page=0')
    })
  })

  describe('complex scenarios', () => {
    it('should handle all parameters together', () => {
      const params = createParams({
        q: 'epic sword',
        price_gte: 50,
        price_lte: 200,
        tier: 'Legendary',
        theme: 'Fantasy',
        category: ['Upper Body', 'Accessory'],
        _sort: 'price',
        _order: 'asc',
        _page: 2,
        _limit: 16,
      })
      const result = buildQueryString(params)

      expect(result).toContain('q=epic+sword')
      expect(result).toContain('price_gte=50')
      expect(result).toContain('price_lte=200')
      expect(result).toContain('tier=Legendary')
      expect(result).toContain('theme=Fantasy')
      expect(result).toContain('category=Upper+Body')
      expect(result).toContain('category=Accessory')
      expect(result).toContain('_sort=price')
      expect(result).toContain('_order=asc')
      expect(result).toContain('_page=2')
      expect(result).toContain('_limit=16')
    })

    it('should return empty string for default values only', () => {
      const params = createParams() // All default values
      const result = buildQueryString(params)

      // Should only contain non-default values (_page=1, _limit=8)
      expect(result).toContain('_page=1')
      expect(result).toContain('_limit=8')
      expect(result).not.toContain('q=')
      expect(result).not.toContain('category')
    })
  })
})
