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

// Mock the sleep utility
jest.mock('../../../../lib/utils', () => ({
  sleep: jest.fn().mockResolvedValue(undefined),
}))

// Mock the client CategoryChip component
jest.mock('../client', () => ({
  CategoryChip: ({ cat }: { cat: string }) => <span data-testid={`category-chip-${cat}`}>{cat}</span>,
}))

import { fetchAvailableCategories } from '../../../data'
import { CategoryChips, CategoryChipsSkeleton, CategoryChipsWrapper } from '../server'

import { render, screen } from '@testing-library/react'

const mockFetchAvailableCategories = fetchAvailableCategories as jest.MockedFunction<typeof fetchAvailableCategories>

describe('CategoryChips Server Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('CategoryChipsWrapper', () => {
    it('should render children in a flex layout container', () => {
      render(
        <CategoryChipsWrapper>
          <div data-testid="child-1">Category 1</div>
          <div data-testid="child-2">Category 2</div>
        </CategoryChipsWrapper>,
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })

    it('should have correct CSS classes for flex layout', () => {
      const { container } = render(
        <CategoryChipsWrapper>
          <div>Test content</div>
        </CategoryChipsWrapper>,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('min-h-8', 'flex', 'flex-wrap', 'gap-2')
    })

    it('should handle empty children', () => {
      const { container } = render(<CategoryChipsWrapper>{null}</CategoryChipsWrapper>)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toBeInTheDocument()
      expect(wrapper).toHaveClass('min-h-8')
    })

    it('should handle multiple children correctly', () => {
      render(
        <CategoryChipsWrapper>
          <span>Art</span>
          <span>Music</span>
          <span>Gaming</span>
          <span>Sports</span>
        </CategoryChipsWrapper>,
      )

      expect(screen.getByText('Art')).toBeInTheDocument()
      expect(screen.getByText('Music')).toBeInTheDocument()
      expect(screen.getByText('Gaming')).toBeInTheDocument()
      expect(screen.getByText('Sports')).toBeInTheDocument()
    })
  })

  describe('CategoryChipsSkeleton', () => {
    it('should render 6 skeleton loading items', () => {
      const { container } = render(<CategoryChipsSkeleton />)

      const skeletonItems = container.querySelectorAll('.bg-gray-200')
      expect(skeletonItems).toHaveLength(6)
    })

    it('should have proper skeleton styling for loading state', () => {
      const { container } = render(<CategoryChipsSkeleton />)

      const skeletonItems = container.querySelectorAll('span')
      expect(skeletonItems).toHaveLength(6)

      skeletonItems.forEach(item => {
        expect(item).toHaveClass('bg-gray-200', 'rounded-md', 'w-16', 'h-8', 'animate-pulse')
      })
    })

    it('should display correct number of skeleton items for loading', () => {
      render(<CategoryChipsSkeleton />)

      // Since skeletons don't have text, we check by class
      const { container } = render(<CategoryChipsSkeleton />)
      const pulsingElements = container.querySelectorAll('.animate-pulse')
      expect(pulsingElements).toHaveLength(6)
    })

    it('should have consistent sizing for skeleton items', () => {
      const { container } = render(<CategoryChipsSkeleton />)

      const skeletonItems = container.querySelectorAll('span')
      skeletonItems.forEach(item => {
        expect(item).toHaveClass('w-16', 'h-8')
      })
    })
  })

  describe('CategoryChips', () => {
    const mockCategories = ['Art', 'Music', 'Gaming', 'Photography', 'Sports']

    beforeEach(() => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: mockCategories,
        themes: ['Dark', 'Light'],
        tiers: ['Basic', 'Premium'],
        maxPrice: 1000,
      })
    })

    it('should fetch categories and render CategoryChip components', async () => {
      const CategoryChipsResolved = await CategoryChips()

      render(<div>{CategoryChipsResolved}</div>)

      // Check that all categories are rendered
      expect(screen.getByTestId('category-chip-Art')).toBeInTheDocument()
      expect(screen.getByTestId('category-chip-Music')).toBeInTheDocument()
      expect(screen.getByTestId('category-chip-Gaming')).toBeInTheDocument()
      expect(screen.getByTestId('category-chip-Photography')).toBeInTheDocument()
      expect(screen.getByTestId('category-chip-Sports')).toBeInTheDocument()

      // Verify text content
      expect(screen.getByText('Art')).toBeInTheDocument()
      expect(screen.getByText('Music')).toBeInTheDocument()
      expect(screen.getByText('Gaming')).toBeInTheDocument()
      expect(screen.getByText('Photography')).toBeInTheDocument()
      expect(screen.getByText('Sports')).toBeInTheDocument()
    })

    it('should call fetchAvailableCategories', async () => {
      await CategoryChips()

      expect(mockFetchAvailableCategories).toHaveBeenCalledTimes(1)
    })

    it('should handle empty categories array', async () => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: [],
        themes: ['Dark'],
        tiers: ['Basic'],
        maxPrice: 100,
      })

      const CategoryChipsResolved = await CategoryChips()
      render(<div>{CategoryChipsResolved}</div>)

      // Should render empty array (no chips)
      expect(screen.queryByTestId(/category-chip-/)).not.toBeInTheDocument()
    })

    it('should handle single category', async () => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: ['Exclusive'],
        themes: ['Dark'],
        tiers: ['Legendary'],
        maxPrice: 5000,
      })

      const CategoryChipsResolved = await CategoryChips()
      render(<div>{CategoryChipsResolved}</div>)

      expect(screen.getByTestId('category-chip-Exclusive')).toBeInTheDocument()
      expect(screen.getByText('Exclusive')).toBeInTheDocument()
    })

    it('should render categories with unique keys', async () => {
      const CategoryChipsResolved = await CategoryChips()
      render(<div>{CategoryChipsResolved}</div>)

      // Each category should have a unique test id
      mockCategories.forEach(category => {
        expect(screen.getByTestId(`category-chip-${category}`)).toBeInTheDocument()
      })
    })

    it('should handle many categories', async () => {
      const manyCategories = Array.from({ length: 20 }, (_, i) => `Category${i + 1}`)
      mockFetchAvailableCategories.mockResolvedValue({
        categories: manyCategories,
        themes: ['Dark'],
        tiers: ['Basic'],
        maxPrice: 100,
      })

      const CategoryChipsResolved = await CategoryChips()
      render(<div>{CategoryChipsResolved}</div>)

      // Should render all 20 categories
      manyCategories.forEach(category => {
        expect(screen.getByTestId(`category-chip-${category}`)).toBeInTheDocument()
      })
    })

    it('should handle categories with special characters', async () => {
      const specialCategories = ['3D Art', 'Sci-Fi', 'AI/ML', 'Virtual Reality']
      mockFetchAvailableCategories.mockResolvedValue({
        categories: specialCategories,
        themes: ['Cyberpunk'],
        tiers: ['Ultra'],
        maxPrice: 10000,
      })

      const CategoryChipsResolved = await CategoryChips()
      render(<div>{CategoryChipsResolved}</div>)

      specialCategories.forEach(category => {
        expect(screen.getByTestId(`category-chip-${category}`)).toBeInTheDocument()
        expect(screen.getByText(category)).toBeInTheDocument()
      })
    })
  })

  describe('Integration: CategoryChips with Wrapper', () => {
    it('should work together for complete category display', async () => {
      mockFetchAvailableCategories.mockResolvedValue({
        categories: ['Digital', 'Traditional'],
        themes: ['Modern'],
        tiers: ['Premium'],
        maxPrice: 500,
      })

      const CategoryChipsResolved = await CategoryChips()

      render(<CategoryChipsWrapper>{CategoryChipsResolved}</CategoryChipsWrapper>)

      // Wrapper should contain the category chips
      expect(screen.getByText('Digital')).toBeInTheDocument()
      expect(screen.getByText('Traditional')).toBeInTheDocument()

      // Check wrapper styling is preserved
      const wrapper = screen.getByText('Digital').closest('.min-h-8')
      expect(wrapper).toHaveClass('flex', 'flex-wrap', 'gap-2')
    })
  })

  describe('Loading States', () => {
    it('should show skeleton during loading then display actual categories', async () => {
      // First render skeleton
      render(
        <CategoryChipsWrapper>
          <CategoryChipsSkeleton />
        </CategoryChipsWrapper>,
      )

      // Should show 6 loading skeletons
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(6)

      // Then render actual categories
      mockFetchAvailableCategories.mockResolvedValue({
        categories: ['Loaded1', 'Loaded2'],
        themes: ['Test'],
        tiers: ['Test'],
        maxPrice: 100,
      })

      const CategoryChipsResolved = await CategoryChips()
      render(<CategoryChipsWrapper>{CategoryChipsResolved}</CategoryChipsWrapper>)

      expect(screen.getByText('Loaded1')).toBeInTheDocument()
      expect(screen.getByText('Loaded2')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle fetchAvailableCategories errors gracefully', async () => {
      mockFetchAvailableCategories.mockRejectedValue(new Error('Network error'))

      await expect(CategoryChips()).rejects.toThrow('Network error')
    })
  })
})
