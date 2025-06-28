import { cache } from 'react'
import type { inferParserType } from 'nuqs/server'
import {
  createLoader,
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs/server'

import { sleep } from '@/lib/utils'

const productSearchParams = {
  q: parseAsString.withDefault(''),
  price_gte: parseAsFloat,
  price_lte: parseAsFloat,
  tier: parseAsString,
  theme: parseAsString,
  category: parseAsArrayOf(parseAsString),
  _sort: parseAsString,
  _order: parseAsStringLiteral(['asc', 'desc'] as const),
  _page: parseAsInteger.withDefault(1),
  _limit: parseAsInteger.withDefault(8),
}

const loadProductSearchParams = createLoader(productSearchParams)

type ProductQueryParams = inferParserType<typeof productSearchParams>

type Product = {
  id: number
  title: string
  category: string
  price: number
  isFavorite: boolean
  createdAt: string
  theme: string
  tier: string
  imageId: number
  authorId: number
}

const buildQueryString = (params: ProductQueryParams) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length) {
      value.forEach(v => searchParams.append(key, String(v)))
    }
    if (value != null && value !== '' && !Array.isArray(value)) {
      searchParams.append(key, String(value))
    }
  })
  return searchParams.toString()
}

const baseUrl = `${process.env.NEXT_PUBLIC_API}`

const productFetcher = async (params: ProductQueryParams, signal?: AbortSignal) => {
  const queryString = buildQueryString(params)
  const res = await fetch(`${baseUrl}/products${queryString ? `?${queryString}` : ''}`, {
    signal,
  })
  const data = (await res.json()) as Product[]
  const total = Number(res.headers.get('X-Total-Count'))
  await sleep(2_000)
  const limit = params._limit || 8
  const page = params._page || 1
  return { data, limit, page, total }
}

const fetchAvailableCategories = cache(async () => {
  const res = await fetch(`${baseUrl}/products`)
  const products = (await res.json()) as Product[]
  const allCategories = products.map(product => product.category)
  const themes = products.map(product => product.theme)
  const tiers = products.map(product => product.tier)
  const uniqueCategories = Array.from(new Set(allCategories))
  const uniqueThemes = Array.from(new Set(themes))
  const uniqueTiers = Array.from(new Set(tiers))
  const maxPrice = Math.max(...products.map(product => product.price))
  return { categories: uniqueCategories, themes: uniqueThemes, tiers: uniqueTiers, maxPrice }
})

const productQueryKey = {
  base: (params?: ProductQueryParams) => ['/products', params] as const,
}

export type { Product, ProductQueryParams }

export { buildQueryString, fetchAvailableCategories, loadProductSearchParams, productFetcher, productQueryKey, productSearchParams }
