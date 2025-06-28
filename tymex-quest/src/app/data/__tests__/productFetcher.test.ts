// Mock nuqs/server first
jest.mock('nuqs/server', () => ({
  createLoader: jest.fn(),
  parseAsArrayOf: jest.fn(),
  parseAsFloat: { withDefault: jest.fn() },
  parseAsInteger: { withDefault: jest.fn() },
  parseAsString: { withDefault: jest.fn() },
  parseAsStringLiteral: jest.fn(),
}))

// Mock the sleep function to avoid waiting in tests
jest.mock('../../../lib/utils', () => ({
  sleep: jest.fn().mockResolvedValue(undefined),
}))

import { productFetcher } from '../../data'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Sample product data
const mockProducts = [
  {
    id: 1,
    title: 'Test Product 1',
    category: 'Art',
    price: 100,
    isFavorite: false,
    createdAt: '2023-01-01',
    theme: 'Dark',
    tier: 'Premium',
    imageId: 1,
    authorId: 1,
  },
  {
    id: 2,
    title: 'Test Product 2',
    category: 'Music',
    price: 200,
    isFavorite: true,
    createdAt: '2023-01-02',
    theme: 'Light',
    tier: 'Basic',
    imageId: 2,
    authorId: 2,
  },
]

// Mock environment variable
const originalEnv = process.env.NEXT_PUBLIC_API

beforeAll(() => {
  process.env.NEXT_PUBLIC_API = 'http://localhost:5005'
})

describe('productFetcher', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_API = originalEnv
  })

  describe('Basic functionality', () => {
    it('should fetch products with default parameters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
        headers: new Map([['X-Total-Count', '42']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({ _page: 1, _limit: 8 })

             expect(mockFetch).toHaveBeenCalledWith('http://localhost:5005/products?_page=1&_limit=8', { signal: undefined })
      expect(result).toEqual({
        data: mockProducts,
        limit: 8,
        page: 1,
        total: 42,
      })
    })

    it('should handle empty parameters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([]),
        headers: new Map([['X-Total-Count', '0']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({})

             expect(mockFetch).toHaveBeenCalledWith('http://localhost:5005/products', { signal: undefined })
      expect(result).toEqual({
        data: [],
        limit: 8, // Default limit
        page: 1, // Default page
        total: 0,
      })
    })
  })

  describe('Query string construction', () => {
    it('should build correct URL with search parameters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
        headers: new Map([['X-Total-Count', '10']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      await productFetcher({
        q: 'search term',
        category: ['Art', 'Music'],
        price_gte: 50,
        price_lte: 500,
        tier: 'Premium',
        theme: 'Dark',
        _page: 2,
        _limit: 12,
        _sort: 'price',
        _order: 'desc',
      })

             expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('http://localhost:5005/products?'), {
         signal: undefined,
       })

      const calledUrl = mockFetch.mock.calls[0][0]
             expect(calledUrl).toContain('q=search+term')
      expect(calledUrl).toContain('category=Art')
      expect(calledUrl).toContain('category=Music')
      expect(calledUrl).toContain('price_gte=50')
      expect(calledUrl).toContain('price_lte=500')
      expect(calledUrl).toContain('tier=Premium')
      expect(calledUrl).toContain('theme=Dark')
      expect(calledUrl).toContain('_page=2')
      expect(calledUrl).toContain('_limit=12')
      expect(calledUrl).toContain('_sort=price')
      expect(calledUrl).toContain('_order=desc')
    })

    it('should handle null and undefined values correctly', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([]),
        headers: new Map([['X-Total-Count', '0']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      await productFetcher({
        q: '',
        price_gte: null,
        price_lte: undefined,
        tier: 'Premium',
        _page: 1,
      })

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).not.toContain('q=')
      expect(calledUrl).not.toContain('price_gte')
      expect(calledUrl).not.toContain('price_lte')
      expect(calledUrl).toContain('tier=Premium')
      expect(calledUrl).toContain('_page=1')
    })
  })

  describe('Response processing', () => {
    it('should parse X-Total-Count header correctly', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
        headers: new Map([['X-Total-Count', '156']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({ _page: 1, _limit: 10 })

      expect(result.total).toBe(156)
    })

    it('should handle missing X-Total-Count header', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
        headers: { get: jest.fn().mockReturnValue(null) },
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({ _page: 1, _limit: 10 })

      expect(result.total).toBe(0) // Number(null) returns 0
    })

    it('should use default limit when not provided', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
        headers: new Map([['X-Total-Count', '25']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({ _page: 3 })

      expect(result.limit).toBe(8) // Default limit
      expect(result.page).toBe(3)
    })

    it('should use default page when not provided', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
        headers: new Map([['X-Total-Count', '25']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({ _limit: 15 })

      expect(result.limit).toBe(15)
      expect(result.page).toBe(1) // Default page
    })
  })

  describe('AbortSignal handling', () => {
    it('should pass AbortSignal to fetch', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
        headers: new Map([['X-Total-Count', '10']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const abortController = new AbortController()
      await productFetcher({ _page: 1 }, abortController.signal)

             expect(mockFetch).toHaveBeenCalledWith('http://localhost:5005/products?_page=1', {
         signal: abortController.signal,
       })
    })

    it('should work without AbortSignal', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
        headers: new Map([['X-Total-Count', '10']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      await productFetcher({ _page: 1 })

             expect(mockFetch).toHaveBeenCalledWith('http://localhost:5005/products?_page=1', { signal: undefined })
    })
  })

  describe('Error scenarios', () => {
    it('should propagate network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(productFetcher({ _page: 1 })).rejects.toThrow('Network error')
    })

    it('should propagate JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        headers: new Map([['X-Total-Count', '10']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      await expect(productFetcher({ _page: 1 })).rejects.toThrow('Invalid JSON')
    })

    it('should handle AbortError', async () => {
      const abortError = new Error('Request aborted')
      abortError.name = 'AbortError'
      mockFetch.mockRejectedValue(abortError)

      const abortController = new AbortController()
      abortController.abort()

      await expect(productFetcher({ _page: 1 }, abortController.signal)).rejects.toThrow('Request aborted')
    })
  })

  describe('Integration with actual Product type structure', () => {
    it('should handle complete product objects', async () => {
      const completeProducts = [
        {
          id: 123,
          title: 'Complex NFT Art',
          category: 'Digital Art',
          price: 999.99,
          isFavorite: true,
          createdAt: '2023-12-01T10:30:00Z',
          theme: 'Cyberpunk',
          tier: 'Legendary',
          imageId: 456,
          authorId: 789,
        },
      ]

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(completeProducts),
        headers: new Map([['X-Total-Count', '1']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({
        q: 'NFT',
        category: ['Digital Art'],
        price_gte: 500,
        _page: 1,
        _limit: 20,
      })

      expect(result.data).toEqual(completeProducts)
      expect(result.data[0]).toHaveProperty('id', 123)
      expect(result.data[0]).toHaveProperty('title', 'Complex NFT Art')
      expect(result.data[0]).toHaveProperty('price', 999.99)
      expect(result.data[0]).toHaveProperty('isFavorite', true)
    })
  })

  describe('Large dataset scenarios', () => {
    it('should handle large page numbers and limits', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([]),
        headers: new Map([['X-Total-Count', '10000']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({ _page: 500, _limit: 100 })

      expect(result.page).toBe(500)
      expect(result.limit).toBe(100)
      expect(result.total).toBe(10000)
    })

    it('should handle zero results', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([]),
        headers: new Map([['X-Total-Count', '0']]),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await productFetcher({
        q: 'nonexistent product',
        _page: 1,
        _limit: 10,
      })

      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })
  })
})
