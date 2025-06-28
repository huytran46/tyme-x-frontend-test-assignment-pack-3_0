// Mock nuqs server imports to avoid ESM issues
jest.mock('nuqs/server', () => ({
  createLoader: jest.fn(),
  parseAsArrayOf: jest.fn(),
  parseAsFloat: { withDefault: jest.fn() },
  parseAsInteger: { withDefault: jest.fn() },
  parseAsString: { withDefault: jest.fn() },
  parseAsStringLiteral: jest.fn(),
}))

import { fetchAvailableCategories } from '@/app/data'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('fetchAvailableCategories', () => {
  const mockProducts = [
    {
      id: 1,
      title: 'Epic Sword',
      category: 'Upper Body',
      price: 100,
      theme: 'Fantasy',
      tier: 'Epic',
      isFavorite: false,
      createdAt: '2024-01-01',
      imageId: 1,
      authorId: 1,
    },
    {
      id: 2,
      title: 'Legendary Shield',
      category: 'Accessory',
      price: 250,
      theme: 'Medieval',
      tier: 'Legendary',
      isFavorite: true,
      createdAt: '2024-01-02',
      imageId: 2,
      authorId: 2,
    },
    {
      id: 3,
      title: 'Common Hat',
      category: 'Hat',
      price: 25,
      theme: 'Fantasy',
      tier: 'Common',
      isFavorite: false,
      createdAt: '2024-01-03',
      imageId: 3,
      authorId: 3,
    },
    {
      id: 4,
      title: 'Another Sword',
      category: 'Upper Body', // Duplicate category
      price: 150,
      theme: 'Dark', // New theme
      tier: 'Epic', // Duplicate tier
      isFavorite: false,
      createdAt: '2024-01-04',
      imageId: 4,
      authorId: 4,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Store original value to restore later
    delete process.env.NEXT_PUBLIC_API
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should fetch and process categories correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProducts),
    })

    const result = await fetchAvailableCategories()

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:5005/products')
    expect(result.categories).toEqual(['Upper Body', 'Accessory', 'Hat'])
    expect(result.categories).toHaveLength(3) // No duplicates
  })

  it('should fetch and process themes correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProducts),
    })

    const result = await fetchAvailableCategories()

    expect(result.themes).toEqual(['Fantasy', 'Medieval', 'Dark'])
    expect(result.themes).toHaveLength(3) // No duplicates
  })

  it('should fetch and process tiers correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProducts),
    })

    const result = await fetchAvailableCategories()

    expect(result.tiers).toEqual(['Epic', 'Legendary', 'Common'])
    expect(result.tiers).toHaveLength(3) // No duplicates
  })

  it('should calculate max price correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProducts),
    })

    const result = await fetchAvailableCategories()

    expect(result.maxPrice).toBe(250) // Highest price from mockProducts
  })

  it('should handle empty products array', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    })

    const result = await fetchAvailableCategories()

    expect(result.categories).toEqual([])
    expect(result.themes).toEqual([])
    expect(result.tiers).toEqual([])
    expect(result.maxPrice).toBe(-Infinity) // Math.max of empty array
  })

  it('should handle single product', async () => {
    const singleProduct = [mockProducts[0]]
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(singleProduct),
    })

    const result = await fetchAvailableCategories()

    expect(result.categories).toEqual(['Upper Body'])
    expect(result.themes).toEqual(['Fantasy'])
    expect(result.tiers).toEqual(['Epic'])
    expect(result.maxPrice).toBe(100)
  })

  it('should remove duplicate values correctly', async () => {
    const duplicateProducts = [
      { ...mockProducts[0] },
      { ...mockProducts[0], id: 5 }, // Same category, theme, tier
      { ...mockProducts[1] },
    ]

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(duplicateProducts),
    })

    const result = await fetchAvailableCategories()

    expect(result.categories).toEqual(['Upper Body', 'Accessory'])
    expect(result.themes).toEqual(['Fantasy', 'Medieval'])
    expect(result.tiers).toEqual(['Epic', 'Legendary'])
  })

  it('should handle products with zero prices', async () => {
    const zeroProducts = [
      { ...mockProducts[0], price: 0 },
      { ...mockProducts[1], price: 50 },
    ]

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(zeroProducts),
    })

    const result = await fetchAvailableCategories()

    expect(result.maxPrice).toBe(50)
  })

  it('should handle fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(fetchAvailableCategories()).rejects.toThrow('Network error')
  })

  it('should preserve original array order for unique values', async () => {
    const orderedProducts = [
      { ...mockProducts[0], category: 'Z-Category', theme: 'Z-Theme', tier: 'Z-Tier' },
      { ...mockProducts[1], category: 'A-Category', theme: 'A-Theme', tier: 'A-Tier' },
      { ...mockProducts[2], category: 'M-Category', theme: 'M-Theme', tier: 'M-Tier' },
    ]

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(orderedProducts),
    })

    const result = await fetchAvailableCategories()

    // Should maintain order of first occurrence
    expect(result.categories).toEqual(['Z-Category', 'A-Category', 'M-Category'])
    expect(result.themes).toEqual(['Z-Theme', 'A-Theme', 'M-Theme'])
    expect(result.tiers).toEqual(['Z-Tier', 'A-Tier', 'M-Tier'])
  })
}) 