jest.mock('nuqs/server', () => ({
  createLoader: jest.fn(),
  parseAsArrayOf: jest.fn(),
  parseAsFloat: { withDefault: jest.fn() },
  parseAsInteger: { withDefault: jest.fn() },
  parseAsString: { withDefault: jest.fn() },
  parseAsStringLiteral: jest.fn(),
}))

import { calculatePaginationPages } from '../product-grid-pagination'

describe('Pagination Logic', () => {
  describe('Few pages (≤5)', () => {
    it('should show all pages when totalPages = 1', () => {
      const result = calculatePaginationPages(1, 1)
      expect(result).toEqual([1])
    })

    it('should show all pages when totalPages = 3', () => {
      const result = calculatePaginationPages(2, 3)
      expect(result).toEqual([1, 2, 3])
    })

    it('should show all pages when totalPages = 5', () => {
      const result = calculatePaginationPages(3, 5)
      expect(result).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('Early pages (page ≤ 3)', () => {
    it('should show correct pattern when page = 1 and totalPages = 10', () => {
      const result = calculatePaginationPages(1, 10)
      expect(result).toEqual([1, 2, 3, 4, 'ellipsis', 10])
    })

    it('should show correct pattern when page = 2 and totalPages = 10', () => {
      const result = calculatePaginationPages(2, 10)
      expect(result).toEqual([1, 2, 3, 4, 'ellipsis', 10])
    })

    it('should show correct pattern when page = 3 and totalPages = 10', () => {
      const result = calculatePaginationPages(3, 10)
      expect(result).toEqual([1, 2, 3, 4, 'ellipsis', 10])
    })

    it('should show correct pattern when page = 1 and totalPages = 6', () => {
      const result = calculatePaginationPages(1, 6)
      expect(result).toEqual([1, 2, 3, 4, 'ellipsis', 6])
    })
  })

  describe('Late pages (page ≥ totalPages - 2)', () => {
    it('should show correct pattern when page = 10 and totalPages = 10', () => {
      const result = calculatePaginationPages(10, 10)
      expect(result).toEqual([1, 'ellipsis', 7, 8, 9, 10])
    })

    it('should show correct pattern when page = 9 and totalPages = 10', () => {
      const result = calculatePaginationPages(9, 10)
      expect(result).toEqual([1, 'ellipsis', 7, 8, 9, 10])
    })

    it('should show correct pattern when page = 8 and totalPages = 10', () => {
      const result = calculatePaginationPages(8, 10)
      expect(result).toEqual([1, 'ellipsis', 7, 8, 9, 10])
    })

    it('should show correct pattern when page = 8 and totalPages = 12', () => {
      const result = calculatePaginationPages(10, 12)
      expect(result).toEqual([1, 'ellipsis', 9, 10, 11, 12])
    })
  })

  describe('Middle pages', () => {
    it('should show correct pattern when page = 5 and totalPages = 10', () => {
      const result = calculatePaginationPages(5, 10)
      expect(result).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
    })

    it('should show correct pattern when page = 6 and totalPages = 12', () => {
      const result = calculatePaginationPages(6, 12)
      expect(result).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 12])
    })

    it('should show correct pattern when page = 4 and totalPages = 8', () => {
      const result = calculatePaginationPages(4, 8)
      expect(result).toEqual([1, 'ellipsis', 3, 4, 5, 'ellipsis', 8])
    })

    it('should show correct pattern when page = 7 and totalPages = 15', () => {
      const result = calculatePaginationPages(7, 15)
      expect(result).toEqual([1, 'ellipsis', 6, 7, 8, 'ellipsis', 15])
    })
  })

  describe('Edge cases', () => {
    it('should handle boundary case at page = 4 with totalPages = 10', () => {
      const result = calculatePaginationPages(4, 10)
      expect(result).toEqual([1, 'ellipsis', 3, 4, 5, 'ellipsis', 10])
    })

    it('should handle boundary case at page = 7 with totalPages = 10', () => {
      const result = calculatePaginationPages(7, 10)
      expect(result).toEqual([1, 'ellipsis', 6, 7, 8, 'ellipsis', 10])
    })

    it('should handle large page numbers', () => {
      const result = calculatePaginationPages(50, 100)
      expect(result).toEqual([1, 'ellipsis', 49, 50, 51, 'ellipsis', 100])
    })

    it('should handle minimum case for late pages logic', () => {
      const result = calculatePaginationPages(4, 6)
      expect(result).toEqual([1, 'ellipsis', 3, 4, 5, 6])
    })
  })

  describe('Comprehensive scenarios', () => {
    it('should test all branches for totalPages = 6', () => {
      // Test early pages
      expect(calculatePaginationPages(1, 6)).toEqual([1, 2, 3, 4, 'ellipsis', 6])
      expect(calculatePaginationPages(2, 6)).toEqual([1, 2, 3, 4, 'ellipsis', 6])
      expect(calculatePaginationPages(3, 6)).toEqual([1, 2, 3, 4, 'ellipsis', 6])

      // Test middle page
      expect(calculatePaginationPages(4, 6)).toEqual([1, 'ellipsis', 3, 4, 5, 6])

      // Test late pages
      expect(calculatePaginationPages(5, 6)).toEqual([1, 'ellipsis', 3, 4, 5, 6])
      expect(calculatePaginationPages(6, 6)).toEqual([1, 'ellipsis', 3, 4, 5, 6])
    })

    it('should verify ellipsis placement is correct', () => {
      const result = calculatePaginationPages(10, 20)
      expect(result).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20])

      // Verify ellipsis positions
      expect(result[1]).toBe('ellipsis')
      expect(result[5]).toBe('ellipsis')
      expect(result.filter(p => p === 'ellipsis')).toHaveLength(2)
    })
  })
})
