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

const productSearchParams = {
  q: parseAsString.withDefault(''),
  price_gte: parseAsFloat,
  price_lte: parseAsFloat,
  tier: parseAsString,
  theme: parseAsString,
  price: parseAsString,
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
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  return searchParams.toString()
}

const productFetcher = async (params: ProductQueryParams, signal?: AbortSignal) => {
  const queryString = buildQueryString(params)
  console.log('queryString', queryString)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products?${queryString}`, {
    signal,
  })
  const data = (await res.json()) as Product[]
  const limit = params._limit || data.length
  const page = params._page || 1
  return { data, limit, page }
}

const fetchProducts = cache(productFetcher)

const fetchAvailableCategories = cache(async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API + '/products')
  const products = (await res.json()) as Array<{ category: string }>
  const allCategories = products.map((product: { category: string }) => product.category)
  const uniqueCategories = Array.from(new Set(allCategories))
  return { categories: uniqueCategories }
})

const productQueryKey = {
  base: (params?: ProductQueryParams) => ['/products', params] as const,
}

export type { Product, ProductQueryParams }

export {
  fetchAvailableCategories,
  fetchProducts,
  loadProductSearchParams,
  productFetcher,
  productQueryKey,
  productSearchParams,
}
