'use client'

import { useMemo, useState } from 'react'
import { useQueryStates } from 'nuqs'

import { productSearchParams } from '@/app/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

let timeout: ReturnType<typeof setTimeout>
function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number) {
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const SearchInput = () => {
  const [productParams, setProductParams] = useQueryStates(productSearchParams)
  const [search, setSearch] = useState(productParams.q)

  const debouncedSetProductParams = useMemo(
    () => debounce((nextValue: string) => setProductParams(prev => ({ ...prev, q: nextValue })), 500),
    [setProductParams],
  )

  return (
    <Input
      placeholder="Search"
      className="mb-4"
      value={search}
      onChange={e => {
        const nextValue = e.target.value
        setSearch(nextValue)
        debouncedSetProductParams(nextValue)
      }}
    />
  )
}

const PriceRangeSlider = ({ max }: { max: number }) => {
  const [productParams, setProductParams] = useQueryStates(productSearchParams)
  const [value, setValue] = useState([productParams.price_gte || 0, productParams.price_lte || max])

  const debouncedSetProductParams = useMemo(
    () =>
      debounce(
        (value: number[]) => setProductParams(prev => ({ ...prev, price_gte: value[0], price_lte: value[1] })),
        500,
      ),
    [setProductParams],
  )

  return (
    <div className="flex flex-col gap-2">
      <Slider
        className="w-full"
        value={value}
        onValueChange={value => {
          setValue(value)
          debouncedSetProductParams(value)
        }}
        min={0}
        max={max}
        step={10}
      />
      <span className="text-xs text-gray-500">
        {value[0]} - {value[1]} ETH
      </span>
    </div>
  )
}

const TierSelect = ({ tiers }: { tiers: string[] }) => {
  const [productParams, setProductParams] = useQueryStates(productSearchParams)

  return (
    <Select
      value={productParams.tier ?? 'all'}
      onValueChange={value => setProductParams(prev => ({ ...prev, tier: value === 'all' ? null : value }))}
    >
      <SelectTrigger className="w-full">
        <SelectValue className="text-sm text-gray-500" placeholder="Select a tier" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {tiers.map(tier => (
          <SelectItem key={tier} value={tier}>
            {tier}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const ThemeSelect = ({ themes }: { themes: string[] }) => {
  const [productParams, setProductParams] = useQueryStates(productSearchParams)
  return (
    <Select
      value={productParams.theme ?? 'all'}
      onValueChange={value => setProductParams(prev => ({ ...prev, theme: value === 'all' ? null : value }))}
    >
      <SelectTrigger className="w-full">
        <SelectValue className="text-sm text-gray-500 w-full" placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {themes.map(theme => (
          <SelectItem key={theme} value={theme}>
            {theme}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const PriceSelect = () => {
  const [productParams, setProductParams] = useQueryStates(productSearchParams)

  let sortType = 'all'
  if (productParams._sort === 'price') {
    sortType = productParams._order || 'all'
  }

  return (
    <Select
      value={sortType}
      onValueChange={value =>
        setProductParams(prev =>
          value === 'all'
            ? { ...prev, _sort: null, _order: null }
            : {
                ...prev,
                _sort: 'price',
                _order: value as 'asc' | 'desc',
              },
        )
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue className="text-sm text-gray-500 w-full" placeholder="Select a price" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">None</SelectItem>
        <SelectItem value="asc">Low to High</SelectItem>
        <SelectItem value="desc">High to Low</SelectItem>
      </SelectContent>
    </Select>
  )
}

const ResetFilterButton = () => {
  const [, setProductParams] = useQueryStates(productSearchParams)

  const handleResetFilter = () => {
    setProductParams(prev => ({
      ...prev,
      q: null,
      tier: null,
      theme: null,
      _sort: null,
      _order: null,
      _page: 1,
      category: null,
      price_gte: null,
      price_lte: null,
    }))
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleResetFilter}>
      Reset Filter
    </Button>
  )
}

export { PriceRangeSlider, PriceSelect, ResetFilterButton, SearchInput, ThemeSelect, TierSelect }
