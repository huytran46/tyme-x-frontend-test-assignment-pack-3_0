'use client'

import { useQueryStates } from 'nuqs'

import {
  ProductCard,
  ProductGridEmptyState,
  ProductGridSkeleton,
  ProductImage,
  ProductInfo,
  ProductLikeButton,
} from '@/app/components/product-grid/server'
import { productSearchParams } from '@/app/data'
import { useInfiniteProducts } from '@/app/hooks/use-infinite-products'

const ProductGrid = () => {
  const [searchParams] = useQueryStates(productSearchParams)
  const { data, isLoading } = useInfiniteProducts(searchParams)
  const products = data?.pages.flatMap(page => page.data) ?? []

  if (isLoading) {
    return <ProductGridSkeleton />
  }

  if (!products.length) {
    return <ProductGridEmptyState />
  }

  return products.map(product => (
    <ProductCard key={product.id}>
      <ProductImage />
      <ProductInfo name={product.title} tier={product.tier} price={product.price} />
      <ProductLikeButton />
    </ProductCard>
  ))
}

export { ProductGrid }
