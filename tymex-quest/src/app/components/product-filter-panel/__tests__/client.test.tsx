/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock nuqs to avoid ESM issues
jest.mock('nuqs', () => ({
  useQueryStates: jest.fn(),
}))

// Mock UI components
jest.mock('../../../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('../../../../components/ui/input', () => ({
  Input: ({ onChange, value, ...props }: any) => (
    <input onChange={onChange} value={value} {...props} />
  ),
}))

jest.mock('../../../../components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value} onClick={() => onValueChange && onValueChange('test')}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
}))

jest.mock('../../../../components/ui/slider', () => ({
  Slider: ({ value, onValueChange, min, max }: any) => (
    <input
      data-testid="slider"
      type="range"
      min={min}
      max={max}
      value={value?.[0] || 0}
      onChange={(e) => onValueChange && onValueChange([parseInt(e.target.value), max])}
    />
  ),
}))

// Mock the productSearchParams
jest.mock('../../../data', () => ({
  productSearchParams: {
    q: null,
    tier: null,
    theme: null,
    _sort: null,
    _order: null,
    _page: 1,
    category: null,
    price_gte: null,
    price_lte: null,
  },
}))

import { useQueryStates } from 'nuqs'

import {
  PriceRangeSlider,
  PriceSelect,
  ResetFilterButton,
  SearchInput,
  ThemeSelect,
  TierSelect,
} from '../client'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const mockUseQueryStates = useQueryStates as jest.MockedFunction<typeof useQueryStates>

describe('ProductFilterPanel Client Components', () => {
  const mockSetProductParams = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    
    mockUseQueryStates.mockReturnValue([
      {
        q: '',
        tier: null,
        theme: null,
        _sort: null,
        _order: null,
        _page: 1,
        category: null,
        price_gte: 0,
        price_lte: 1000,
      },
      mockSetProductParams,
    ])
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('ResetFilterButton', () => {
    it('should render reset button', () => {
      render(<ResetFilterButton />)
      
      expect(screen.getByText('Reset Filter')).toBeInTheDocument()
    })

    it('should call setProductParams with reset values when clicked', () => {
      render(<ResetFilterButton />)
      
      fireEvent.click(screen.getByText('Reset Filter'))
      
      expect(mockSetProductParams).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should reset all filter parameters', () => {
      render(<ResetFilterButton />)
      
      fireEvent.click(screen.getByText('Reset Filter'))
      
      // Get the function passed to setProductParams
      const updateFunction = mockSetProductParams.mock.calls[0][0]
      const result = updateFunction({})
      
      expect(result).toEqual({
        q: null,
        tier: null,
        theme: null,
        _sort: null,
        _order: null,
        _page: 1,
        category: null,
        price_gte: null,
        price_lte: null,
      })
    })

    it('should have proper button styling', () => {
      render(<ResetFilterButton />)
      
      const button = screen.getByText('Reset Filter')
      expect(button).toHaveAttribute('variant', 'outline')
      expect(button).toHaveClass('w-full')
    })
  })

  describe('SearchInput', () => {
    it('should render search input', () => {
      render(<SearchInput />)
      
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    })

    it('should display current search value', () => {
      mockUseQueryStates.mockReturnValue([
        { q: 'test search', tier: null, theme: null, _sort: null, _order: null, _page: 1, category: null, price_gte: 0, price_lte: 1000 },
        mockSetProductParams,
      ])
      
      render(<SearchInput />)
      
      expect(screen.getByDisplayValue('test search')).toBeInTheDocument()
    })

    it('should update local state immediately on input change', () => {
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search')
      fireEvent.change(input, { target: { value: 'new search' } })
      
      expect(input).toHaveValue('new search')
    })

    it('should debounce search updates', async () => {
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search')
      fireEvent.change(input, { target: { value: 'test' } })
      
      // Should not call immediately
      expect(mockSetProductParams).not.toHaveBeenCalled()
      
      // Fast-forward time to trigger debounce
      jest.advanceTimersByTime(500)
      
      await waitFor(() => {
        expect(mockSetProductParams).toHaveBeenCalledWith(expect.any(Function))
      })
    })

    it('should have proper input styling', () => {
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search')
      expect(input).toHaveClass('mb-4')
    })
  })

  describe('PriceRangeSlider', () => {
    it('should render price range slider', () => {
      render(<PriceRangeSlider max={1000} />)
      
      expect(screen.getByTestId('slider')).toBeInTheDocument()
    })

    it('should display price range text', () => {
      render(<PriceRangeSlider max={1000} />)
      
      expect(screen.getByText('0 - 1000 ETH')).toBeInTheDocument()
    })

    it('should use current price range from query params', () => {
      mockUseQueryStates.mockReturnValue([
        { q: '', tier: null, theme: null, _sort: null, _order: null, _page: 1, category: null, price_gte: 100, price_lte: 500 },
        mockSetProductParams,
      ])
      
      render(<PriceRangeSlider max={1000} />)
      
      expect(screen.getByText('100 - 500 ETH')).toBeInTheDocument()
    })

    it('should handle slider value changes', () => {
      render(<PriceRangeSlider max={1000} />)
      
      const slider = screen.getByTestId('slider')
      fireEvent.change(slider, { target: { value: '200' } })
      
      // Should update local state immediately
      expect(screen.getByText('200 - 1000 ETH')).toBeInTheDocument()
    })

    it('should have correct slider attributes', () => {
      render(<PriceRangeSlider max={1000} />)
      
      const slider = screen.getByTestId('slider')
      expect(slider).toHaveAttribute('min', '0')
      expect(slider).toHaveAttribute('max', '1000')
    })
  })

  describe('TierSelect', () => {
    const mockTiers = ['Basic', 'Premium', 'Legendary']

    it('should render tier select', () => {
      render(<TierSelect tiers={mockTiers} />)
      
      expect(screen.getByTestId('select')).toBeInTheDocument()
    })

    it('should display all tier options', () => {
      render(<TierSelect tiers={mockTiers} />)
      
      expect(screen.getByTestId('select-item-all')).toBeInTheDocument()
      expect(screen.getByTestId('select-item-Basic')).toBeInTheDocument()
      expect(screen.getByTestId('select-item-Premium')).toBeInTheDocument()
      expect(screen.getByTestId('select-item-Legendary')).toBeInTheDocument()
    })

    it('should show current tier value', () => {
      mockUseQueryStates.mockReturnValue([
        { q: '', tier: 'Premium', theme: null, _sort: null, _order: null, _page: 1, category: null, price_gte: 0, price_lte: 1000 },
        mockSetProductParams,
      ])
      
      render(<TierSelect tiers={mockTiers} />)
      
      expect(screen.getByTestId('select')).toHaveAttribute('data-value', 'Premium')
    })

    it('should default to "all" when no tier selected', () => {
      render(<TierSelect tiers={mockTiers} />)
      
      expect(screen.getByTestId('select')).toHaveAttribute('data-value', 'all')
    })

    it('should handle tier selection', () => {
      render(<TierSelect tiers={mockTiers} />)
      
      fireEvent.click(screen.getByTestId('select'))
      
      expect(mockSetProductParams).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('ThemeSelect', () => {
    const mockThemes = ['Dark', 'Light', 'Cyberpunk']

    it('should render theme select', () => {
      render(<ThemeSelect themes={mockThemes} />)
      
      expect(screen.getByTestId('select')).toBeInTheDocument()
    })

    it('should display all theme options', () => {
      render(<ThemeSelect themes={mockThemes} />)
      
      expect(screen.getByTestId('select-item-all')).toBeInTheDocument()
      expect(screen.getByTestId('select-item-Dark')).toBeInTheDocument()
      expect(screen.getByTestId('select-item-Light')).toBeInTheDocument()
      expect(screen.getByTestId('select-item-Cyberpunk')).toBeInTheDocument()
    })

    it('should show current theme value', () => {
      mockUseQueryStates.mockReturnValue([
        { q: '', tier: null, theme: 'Dark', _sort: null, _order: null, _page: 1, category: null, price_gte: 0, price_lte: 1000 },
        mockSetProductParams,
      ])
      
      render(<ThemeSelect themes={mockThemes} />)
      
      expect(screen.getByTestId('select')).toHaveAttribute('data-value', 'Dark')
    })

    it('should default to "all" when no theme selected', () => {
      render(<ThemeSelect themes={mockThemes} />)
      
      expect(screen.getByTestId('select')).toHaveAttribute('data-value', 'all')
    })
  })

  describe('PriceSelect', () => {
    it('should render price select', () => {
      render(<PriceSelect />)
      
      expect(screen.getByTestId('select')).toBeInTheDocument()
    })

    it('should display price sort options', () => {
      render(<PriceSelect />)
      
      expect(screen.getByTestId('select-item-all')).toBeInTheDocument()
      expect(screen.getByTestId('select-item-asc')).toBeInTheDocument()
      expect(screen.getByTestId('select-item-desc')).toBeInTheDocument()
    })

    it('should show "all" when no sort selected', () => {
      render(<PriceSelect />)
      
      expect(screen.getByTestId('select')).toHaveAttribute('data-value', 'all')
    })

    it('should show ascending sort when selected', () => {
      mockUseQueryStates.mockReturnValue([
        { q: '', tier: null, theme: null, _sort: 'price', _order: 'asc', _page: 1, category: null, price_gte: 0, price_lte: 1000 },
        mockSetProductParams,
      ])
      
      render(<PriceSelect />)
      
      expect(screen.getByTestId('select')).toHaveAttribute('data-value', 'asc')
    })

    it('should show descending sort when selected', () => {
      mockUseQueryStates.mockReturnValue([
        { q: '', tier: null, theme: null, _sort: 'price', _order: 'desc', _page: 1, category: null, price_gte: 0, price_lte: 1000 },
        mockSetProductParams,
      ])
      
      render(<PriceSelect />)
      
      expect(screen.getByTestId('select')).toHaveAttribute('data-value', 'desc')
    })
  })

  describe('Integration Tests', () => {
    it('should handle empty arrays gracefully', () => {
      render(
        <div>
          <TierSelect tiers={[]} />
          <ThemeSelect themes={[]} />
        </div>
      )
      
      // Should still render selects with just "All" option
      expect(screen.getAllByTestId('select-item-all')).toHaveLength(2)
    })

    it('should work with different max price values', () => {
      // Mock state to use max value when price_lte is null
      mockUseQueryStates.mockReturnValue([
        { q: '', tier: null, theme: null, _sort: null, _order: null, _page: 1, category: null, price_gte: 0, price_lte: null },
        mockSetProductParams,
      ])
      
      render(<PriceRangeSlider max={5000} />)
      
      expect(screen.getByText(/0.*-.*5000.*ETH/)).toBeInTheDocument()
      
      const slider = screen.getByTestId('slider')
      expect(slider).toHaveAttribute('max', '5000')
    })

    it('should handle null query state values gracefully', () => {
      mockUseQueryStates.mockReturnValue([
        { q: null, tier: null, theme: null, _sort: null, _order: null, _page: 1, category: null, price_gte: null, price_lte: null },
        mockSetProductParams,
      ])
      
      render(
        <div>
          <SearchInput />
          <TierSelect tiers={['Basic']} />
          <ThemeSelect themes={['Dark']} />
        </div>
      )
      
      // Should handle null values without crashing
      expect(screen.getByPlaceholderText('Search')).toHaveValue('')
      expect(screen.getAllByTestId('select')).toHaveLength(2)
    })
  })
}) 