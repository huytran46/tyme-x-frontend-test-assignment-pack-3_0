import React from 'react'

// Mock nuqs to avoid ESM issues
jest.mock('nuqs/server', () => ({
  createLoader: jest.fn(),
  parseAsArrayOf: jest.fn(),
  parseAsFloat: { withDefault: jest.fn() },
  parseAsInteger: { withDefault: jest.fn() },
  parseAsString: { withDefault: jest.fn() },
  parseAsStringLiteral: jest.fn(),
}))

// Mock the fetchAvailableCategories function
jest.mock('../../../data', () => ({
  fetchAvailableCategories: jest.fn(),
}))

// Mock all the client components
jest.mock('../client', () => ({
  PriceRangeSlider: ({ max }: { max: number }) => <div data-testid="price-range-slider">Price Range (max: {max})</div>,
  PriceSelect: () => <div data-testid="price-select">Price Select</div>,
  ResetFilterButton: () => <button data-testid="reset-filter-button">Reset Filters</button>,
  SearchInput: () => <input data-testid="search-input" placeholder="Search..." />,
  ThemeSelect: ({ themes }: { themes: string[] }) => (
    <select data-testid="theme-select">
      {themes.map(theme => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </select>
  ),
  TierSelect: ({ tiers }: { tiers: string[] }) => (
    <select data-testid="tier-select">
      {tiers.map(tier => (
        <option key={tier} value={tier}>
          {tier}
        </option>
      ))}
    </select>
  ),
}))

import { Suspense } from 'react'

import { fetchAvailableCategories } from '../../../data'

import { render, screen } from '@testing-library/react'

const mockFetchAvailableCategories = fetchAvailableCategories as jest.MockedFunction<typeof fetchAvailableCategories>

// Import the components after mocking
import { ProductFilterPanel } from '../server'

describe('ProductFilterPanel Server Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('ProductFilterPanel', () => {
    const mockFilterData = {
      categories: ['Art', 'Music', 'Gaming'],
      themes: ['Dark', 'Light', 'Cyberpunk'],
      tiers: ['Basic', 'Premium', 'Legendary'],
      maxPrice: 1500,
    }

    beforeEach(() => {
      mockFetchAvailableCategories.mockResolvedValue(mockFilterData)
    })

    it('should fetch filter data and render all filter components', async () => {
      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

      expect(mockFetchAvailableCategories).toHaveBeenCalledTimes(1)

      // Check for all the filter components
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByTestId('price-range-slider')).toBeInTheDocument()
      expect(screen.getByTestId('tier-select')).toBeInTheDocument()
      expect(screen.getByTestId('theme-select')).toBeInTheDocument()
      expect(screen.getByTestId('price-select')).toBeInTheDocument()
      expect(screen.getByTestId('reset-filter-button')).toBeInTheDocument()
    })

    it('should pass correct props to filter components', async () => {
      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

      // Check PriceRangeSlider receives max price
      expect(screen.getByText('Price Range (max: 1500)')).toBeInTheDocument()

             // Check ThemeSelect has all themes
       const themeSelect = screen.getByTestId('theme-select')
       expect(themeSelect).toBeInTheDocument()
       expect(screen.getByText('Dark')).toBeInTheDocument()
       expect(screen.getByText('Light')).toBeInTheDocument()
       expect(screen.getByText('Cyberpunk')).toBeInTheDocument()

       // Check TierSelect has all tiers
       const tierSelect = screen.getByTestId('tier-select')
       expect(tierSelect).toBeInTheDocument()
       expect(screen.getByText('Basic')).toBeInTheDocument()
       expect(screen.getByText('Premium')).toBeInTheDocument()
       expect(screen.getByText('Legendary')).toBeInTheDocument()
    })

    it('should render filter labels correctly', async () => {
      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

      // Check for all section labels
      expect(screen.getByText('Price Range')).toBeInTheDocument()
      expect(screen.getByText('Tier')).toBeInTheDocument()
      expect(screen.getByText('Theme')).toBeInTheDocument()
      expect(screen.getByText('Price')).toBeInTheDocument()
    })

    it('should handle empty filter data', async () => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: [],
        themes: [],
        tiers: [],
        maxPrice: 0,
      })

      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

      // Should still render all components
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByText('Price Range (max: 0)')).toBeInTheDocument()
      expect(screen.getByTestId('tier-select')).toBeInTheDocument()
      expect(screen.getByTestId('theme-select')).toBeInTheDocument()
    })

    it('should handle large max price values', async () => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: ['Test'],
        themes: ['Test'],
        tiers: ['Test'],
        maxPrice: 999999,
      })

      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

      expect(screen.getByText('Price Range (max: 999999)')).toBeInTheDocument()
    })

    it('should handle single item arrays', async () => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: ['SingleCategory'],
        themes: ['SingleTheme'],
        tiers: ['SingleTier'],
        maxPrice: 100,
      })

      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

             expect(screen.getByText('SingleTheme')).toBeInTheDocument()
       expect(screen.getByText('SingleTier')).toBeInTheDocument()
    })

    it('should handle themes with special characters', async () => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: ['Test'],
        themes: ['Sci-Fi', '80s Retro', 'Neo-Tokyo'],
        tiers: ['Ultra-Rare', 'One-of-a-Kind'],
        maxPrice: 5000,
      })

      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

             expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
       expect(screen.getByText('80s Retro')).toBeInTheDocument()
       expect(screen.getByText('Neo-Tokyo')).toBeInTheDocument()
       expect(screen.getByText('Ultra-Rare')).toBeInTheDocument()
       expect(screen.getByText('One-of-a-Kind')).toBeInTheDocument()
    })

    it('should be wrapped in React Fragment', async () => {
      const ProductFilterPanelResolved = await ProductFilterPanel()

      // The component should return multiple elements (Fragment behavior)
      expect(Array.isArray(ProductFilterPanelResolved.props.children)).toBe(true)
    })

    it('should render components in correct order', async () => {
      const ProductFilterPanelResolved = await ProductFilterPanel()

      const { container } = render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

      // Get all the text content in order
      const textContent = container.textContent || ''

      // Check that sections appear in the expected order
      const searchIndex = textContent.indexOf('Search...')
      const priceRangeIndex = textContent.indexOf('Price Range')
      const tierIndex = textContent.indexOf('Tier')
      const themeIndex = textContent.indexOf('Theme')
      const priceIndex = textContent.lastIndexOf('Price') // Last occurrence for "Price" label
      const resetIndex = textContent.indexOf('Reset Filters')

      expect(searchIndex).toBeLessThan(priceRangeIndex)
      expect(priceRangeIndex).toBeLessThan(tierIndex)
      expect(tierIndex).toBeLessThan(themeIndex)
      expect(themeIndex).toBeLessThan(priceIndex)
      expect(priceIndex).toBeLessThan(resetIndex)
    })
  })

  describe('Error Handling', () => {
    it('should handle fetchAvailableCategories errors gracefully', async () => {
      mockFetchAvailableCategories.mockRejectedValue(new Error('Network error'))

      await expect(ProductFilterPanel()).rejects.toThrow('Network error')
    })

    it('should handle empty arrays gracefully', async () => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: [],
        themes: [],
        tiers: [],
        maxPrice: 0,
      })

      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

      // Should still render without crashing
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })
  })

  describe('Integration with Suspense', () => {
    it('should work correctly with Suspense boundaries', async () => {
      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <div>
          <Suspense fallback={<div data-testid="loading">Loading filters...</div>}>
            {ProductFilterPanelResolved}
          </Suspense>
        </div>,
      )

      // After resolution, should show actual components not loading
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })

    it('should handle nested Suspense correctly', async () => {
      const ProductFilterPanelResolved = await ProductFilterPanel()

      render(
        <Suspense fallback={<div>Outer loading...</div>}>
          <Suspense fallback={<div>Inner loading...</div>}>
            {ProductFilterPanelResolved}
          </Suspense>
        </Suspense>,
      )

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByTestId('price-range-slider')).toBeInTheDocument()
      expect(screen.getByTestId('reset-filter-button')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should have proper MetaRow structure for each section', async () => {
      const ProductFilterPanelResolved = await ProductFilterPanel()

      const { container } = render(
        <Suspense fallback={<div>Loading...</div>}>
          {ProductFilterPanelResolved}
        </Suspense>,
      )

      // Each MetaRow should have a label and content
      const metaRows = container.querySelectorAll('.mb-4')
      expect(metaRows.length).toBeGreaterThan(0) // Should have multiple MetaRow sections

      // Each should have a label with proper styling
      const labels = container.querySelectorAll('.text-sm.font-medium')
      expect(labels.length).toBeGreaterThanOrEqual(4) // At least 4 labels (Price Range, Tier, Theme, Price)
    })

         it('should maintain correct styling for labels', async () => {
       const ProductFilterPanelResolved = await ProductFilterPanel()

       render(
         <Suspense fallback={<div>Loading...</div>}>
           {ProductFilterPanelResolved}
         </Suspense>,
       )

       // Check that labels have correct classes
       const priceRangeLabel = screen.getByText('Price Range')
       expect(priceRangeLabel).toHaveClass('block', 'mb-1', 'text-sm', 'font-medium')

       const tierLabel = screen.getByText('Tier')
       expect(tierLabel).toHaveClass('block', 'mb-1', 'text-sm', 'font-medium')

       const themeLabel = screen.getByText('Theme')
       expect(themeLabel).toHaveClass('block', 'mb-1', 'text-sm', 'font-medium')
     })
  })
}) 