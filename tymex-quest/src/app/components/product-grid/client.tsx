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
import { Button } from '@/components/ui/button'

const ProductGridError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Error Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && <Button onClick={onRetry}>Try Again</Button>}

        <Button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  )
}

const ProductGrid = () => {
  const [searchParams] = useQueryStates(productSearchParams)
  const { data, isLoading, error, refetch } = useInfiniteProducts(searchParams)
  const products = data?.pages.flatMap(page => page.data) ?? []

  if (isLoading) {
    return <ProductGridSkeleton />
  }

  if (error) {
    return <ProductGridError onRetry={() => refetch()} />
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
