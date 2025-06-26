'use client'

import { startTransition, useMemo, useState } from 'react'
import { useQueryStates } from 'nuqs'

import { productSearchParams } from '@/app/data'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    () =>
      debounce(
        (nextValue: string) =>
          startTransition(() => {
            setProductParams(prev => ({ ...prev, q: nextValue }))
          }),
        500,
      ),
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

export { PriceSelect, SearchInput, ThemeSelect, TierSelect }
