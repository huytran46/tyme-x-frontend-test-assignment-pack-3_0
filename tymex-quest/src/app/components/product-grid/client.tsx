'use client'

import { useQueryStates } from 'nuqs'

import {
  ProductCard,
  ProductGridEmptyState,
  ProductGridSkeleton,
  ProductImage,
  ProductInfo,
  ProductLikeButton,
  ProductTierBadge,
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
    <div key={product.id}>
      <ProductCard>
        <div className="flex justify-end absolute top-2 right-2">
          <ProductTierBadge tier={product.tier} />
        </div>
        <ProductImage />
        <ProductInfo name={product.title} tier={product.category} price={product.price} />
        <ProductLikeButton />
      </ProductCard>
    </div>
  ))
}

export { ProductGrid }
