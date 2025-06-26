'use client'

import { useMemo, useState } from 'react'
import { useQueryStates } from 'nuqs'

import { productSearchParams } from '@/app/data'
import { Input } from '@/components/ui/input'

let timeout: ReturnType<typeof setTimeout>
function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number) {
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const ProductNameSearch = () => {
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

export { ProductNameSearch }
