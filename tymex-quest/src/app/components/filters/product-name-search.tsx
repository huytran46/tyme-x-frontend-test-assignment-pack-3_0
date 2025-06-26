'use client'

import { startTransition, useState } from 'react'
import { useQueryStates } from 'nuqs'

import { productSearchParams } from '@/app/data'
import { Input } from '@/components/ui/input'

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
//   let timeout: ReturnType<typeof setTimeout>
//   return (...args: Parameters<T>): void => {
//     if (timeout) clearTimeout(timeout)
//     timeout = setTimeout(() => fn(...args), delay)
//   }
// }

const ProductNameSearch = () => {
  const [search, setSearch] = useState('')
  const [, setProductParams] = useQueryStates(productSearchParams)
  return (
    <Input
      placeholder="Search"
      className="mb-4"
      value={search}
      onChange={e => {
        const nextValue = e.target.value
        setSearch(nextValue)
        startTransition(() => {
          setProductParams(prev => ({ ...prev, q: nextValue }))
        })
      }}
    />
  )
}

export { ProductNameSearch }
