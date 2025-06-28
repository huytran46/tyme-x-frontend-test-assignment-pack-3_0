// Mock nuqs to avoid ESM issues
jest.mock('nuqs/server', () => ({
  createLoader: jest.fn(),
  parseAsArrayOf: jest.fn(),
  parseAsFloat: { withDefault: jest.fn() },
  parseAsInteger: { withDefault: jest.fn() },
  parseAsString: { withDefault: jest.fn() },
  parseAsStringLiteral: jest.fn(),
}))

import {
  ProductCard,
  ProductGridEmptyState,
  ProductGridSkeleton,
  ProductGridWrapper,
  ProductImage,
  ProductInfo,
  ProductLikeButton,
  ProductTierBadge,
} from '../server'

import { render, screen } from '@testing-library/react'

describe('ProductGrid Server Components', () => {
  describe('ProductGridWrapper', () => {
    it('should render children in a grid layout', () => {
      render(
        <ProductGridWrapper>
          <div data-testid="child-1">Product 1</div>
          <div data-testid="child-2">Product 2</div>
        </ProductGridWrapper>,
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })

    it('should have correct CSS classes for responsive grid', () => {
      const { container } = render(
        <ProductGridWrapper>
          <div>Test</div>
        </ProductGridWrapper>,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('min-h-[668px]', 'grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-6')
    })
  })

  describe('ProductGridSkeleton', () => {
    it('should render 8 skeleton cards for loading state', () => {
      const { container } = render(<ProductGridSkeleton />)

      // Should render 8 skeleton items
      const skeletonCards = container.querySelectorAll('.bg-white.rounded.shadow')
      expect(skeletonCards).toHaveLength(8)
    })

    it('should show loading state with proper styling', () => {
      const { container } = render(<ProductGridSkeleton />)

      // Check for loading indicators
      expect(container.querySelector('.opacity-60')).toBeInTheDocument()
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('should display placeholder content in skeleton cards', () => {
      render(<ProductGridSkeleton />)

      // Should show placeholder image text
      expect(screen.getAllByText('Image')).toHaveLength(8)
      expect(screen.getAllByText('Name')).toHaveLength(8)
    })
  })

  describe('ProductGridEmptyState', () => {
    it('should render empty state message', () => {
      render(<ProductGridEmptyState />)

      expect(screen.getByText('No products found.')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your filters or search.')).toBeInTheDocument()
    })

    it('should span full grid width with proper classes', () => {
      const { container } = render(<ProductGridEmptyState />)

      const emptyState = container.firstChild as HTMLElement
      expect(emptyState).toHaveClass('col-span-1', 'sm:col-span-2', 'lg:col-span-4')
    })

    it('should display an icon for visual feedback', () => {
      const { container } = render(<ProductGridEmptyState />)

      // Should have an SVG icon
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('width', '40')
      expect(icon).toHaveAttribute('height', '40')
    })

    it('should have proper spacing and layout', () => {
      const { container } = render(<ProductGridEmptyState />)

      const emptyState = container.firstChild as HTMLElement
      expect(emptyState).toHaveClass('min-h-[400px]', 'flex', 'justify-center', 'pt-20')
    })
  })

  describe('ProductCard', () => {
    it('should render children in card layout', () => {
      render(
        <ProductCard>
          <div data-testid="card-content">Product content</div>
        </ProductCard>,
      )

      expect(screen.getByTestId('card-content')).toBeInTheDocument()
    })

    it('should have proper card styling', () => {
      const { container } = render(
        <ProductCard>
          <div>Content</div>
        </ProductCard>,
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-white', 'rounded', 'shadow', 'p-3', 'flex', 'flex-col', 'relative')
    })
  })

  describe('ProductImage', () => {
    it('should render placeholder image', () => {
      render(<ProductImage />)

      expect(screen.getByText('Image')).toBeInTheDocument()
    })

    it('should have correct aspect ratio and styling', () => {
      const { container } = render(<ProductImage />)

      const imageContainer = container.firstChild as HTMLElement
      expect(imageContainer).toHaveClass('w-full', 'aspect-square', 'bg-gray-200', 'rounded', 'mb-2')
    })

    it('should be centered and properly styled', () => {
      const { container } = render(<ProductImage />)

      const imageContainer = container.firstChild as HTMLElement
      expect(imageContainer).toHaveClass('flex', 'items-center', 'justify-center')
    })
  })

  describe('ProductInfo', () => {
    const mockProduct = {
      name: 'Cool NFT Art',
      tier: 'Premium',
      price: 2.5,
    }

    it('should display product information correctly', () => {
      render(<ProductInfo {...mockProduct} />)

      expect(screen.getByText('Cool NFT Art')).toBeInTheDocument()
      expect(screen.getByText('Premium')).toBeInTheDocument()
      expect(screen.getByText('2.5 ETH')).toBeInTheDocument()
    })

    it('should have proper text styling and hierarchy', () => {
      render(<ProductInfo {...mockProduct} />)

      const name = screen.getByText('Cool NFT Art')
      const tier = screen.getByText('Premium')
      const price = screen.getByText('2.5 ETH')

      expect(name).toHaveClass('font-semibold')
      expect(tier).toHaveClass('text-xs', 'text-gray-500')
      expect(price).toHaveClass('text-sm', 'mt-1')
    })

    it('should handle different price formats', () => {
      render(<ProductInfo name="Test" tier="Basic" price={0.001} />)
      expect(screen.getByText('0.001 ETH')).toBeInTheDocument()

      render(<ProductInfo name="Test" tier="Basic" price={1000} />)
      expect(screen.getByText('1000 ETH')).toBeInTheDocument()
    })

    it('should handle edge cases', () => {
      render(<ProductInfo name="" tier="" price={0} />)

      expect(screen.getByText('0 ETH')).toBeInTheDocument()
    })
  })

  describe('ProductTierBadge', () => {
    it('should display tier text', () => {
      render(<ProductTierBadge tier="Legendary" />)
      expect(screen.getByText('Legendary')).toBeInTheDocument()
    })

    it('should have proper badge styling', () => {
      const { container } = render(<ProductTierBadge tier="Premium" />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveClass(
        'px-1',
        'rounded-md',
        'text-neutral-foreground',
        'bg-neutral-100',
        'border',
        'border-neutral-300',
      )
    })

    it('should have small font size', () => {
      const { container } = render(<ProductTierBadge tier="Basic" />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveStyle({ fontSize: '10px' })
    })

    it('should handle different tier values', () => {
      render(<ProductTierBadge tier="--" />)
      expect(screen.getByText('--')).toBeInTheDocument()

      render(<ProductTierBadge tier="Ultra Rare" />)
      expect(screen.getByText('Ultra Rare')).toBeInTheDocument()
    })
  })

  describe('ProductLikeButton', () => {
    it('should render like button with heart icon', () => {
      render(<ProductLikeButton />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()

      // Check for heart icon
      expect(screen.getByLabelText('favorite')).toBeInTheDocument()
      expect(screen.getByText('♡')).toBeInTheDocument()
    })

    it('should have proper styling and hover effects', () => {
      render(<ProductLikeButton />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-gray-400', 'hover:text-red-400')
    })

    it('should be positioned correctly', () => {
      const { container } = render(<ProductLikeButton />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex', 'justify-end', 'mt-2')
    })
  })

  describe('Integration: Complete Product Card', () => {
    it('should render a complete product card with all components', () => {
      render(
        <ProductCard>
          <ProductTierBadge tier="Premium" />
          <ProductImage />
          <ProductInfo name="Amazing NFT" tier="Premium" price={5.5} />
          <ProductLikeButton />
        </ProductCard>,
      )

      // All parts should be present
      expect(screen.getAllByText('Premium')).toHaveLength(2) // Tier badge + product tier
      expect(screen.getByText('Image')).toBeInTheDocument()
      expect(screen.getByText('Amazing NFT')).toBeInTheDocument()
      expect(screen.getByText('5.5 ETH')).toBeInTheDocument()
      expect(screen.getByLabelText('favorite')).toBeInTheDocument()
    })
  })

  describe('System States Requirements', () => {
    it('should handle loading state properly', () => {
      // Test loading state with skeleton
      render(
        <ProductGridWrapper>
          <ProductGridSkeleton />
        </ProductGridWrapper>,
      )

      // Should show 8 loading cards
      const skeletonCards = screen.getAllByText('Image')
      expect(skeletonCards).toHaveLength(8)

      // Should have loading animations
      const loadingElements = document.querySelectorAll('.animate-pulse')
      expect(loadingElements.length).toBeGreaterThan(0)
    })

    it('should handle empty/no data state properly', () => {
      // Test empty state
      render(
        <ProductGridWrapper>
          <ProductGridEmptyState />
        </ProductGridWrapper>,
      )

      expect(screen.getByText('No products found.')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your filters or search.')).toBeInTheDocument()
    })

    it('should handle data display state properly', () => {
      // Test with actual data
      render(
        <ProductGridWrapper>
          <ProductCard>
            <ProductTierBadge tier="Legendary" />
            <ProductImage />
            <ProductInfo name="Epic NFT Collection" tier="Legendary" price={10.0} />
            <ProductLikeButton />
          </ProductCard>
          <ProductCard>
            <ProductTierBadge tier="Rare" />
            <ProductImage />
            <ProductInfo name="Cool Digital Art" tier="Rare" price={3.2} />
            <ProductLikeButton />
          </ProductCard>
        </ProductGridWrapper>,
      )

      // Should display actual product data
      expect(screen.getByText('Epic NFT Collection')).toBeInTheDocument()
      expect(screen.getByText('Cool Digital Art')).toBeInTheDocument()
      expect(screen.getByText('10 ETH')).toBeInTheDocument()
      expect(screen.getByText('3.2 ETH')).toBeInTheDocument()

      // Should have interactive elements
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })
  })
})
