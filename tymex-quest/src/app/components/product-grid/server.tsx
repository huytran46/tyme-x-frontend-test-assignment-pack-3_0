import type { PropsWithChildren } from 'react'
import type { SearchParams } from 'nuqs/server'

import { fetchProducts, loadProductSearchParams, productQueryKey } from '@/app/data'
import { sleep } from '@/lib/utils'

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

const ProductCardSkeleton = () => (
  <div className="bg-white rounded shadow p-3 flex flex-col">
    <div className="w-full aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
      <span className="text-gray-400">Image</span>
    </div>
    <div className="flex-1">
      <div className="font-semibold">Name</div>
      <div className="text-xs text-gray-500">Tier</div>
      <div className="text-sm mt-1">0.00 ETH</div>
    </div>
    <div className="flex justify-end mt-2">
      <button className="text-gray-400 hover:text-red-400">
        <span role="img" aria-label="favorite">
          ♡
        </span>
      </button>
    </div>
  </div>
)

const ProductImage = () => (
  <div className="w-full aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
    <span className="text-gray-400">Image</span>
  </div>
)

const ProductInfo = ({ name, tier, price }: { name: string; tier: string; price: number }) => (
  <div className="flex-1">
    <div className="font-semibold">{name}</div>
    <div className="text-xs text-gray-500">{tier}</div>
    <div className="text-sm mt-1">{price} ETH</div>
  </div>
)

const ProductLikeButton = () => (
  <div className="flex justify-end mt-2">
    <button className="text-gray-400 hover:text-red-400">
      <span role="img" aria-label="favorite">
        ♡
      </span>
    </button>
  </div>
)

const ProductCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded shadow p-3 flex flex-col">{children}</div>
)

const ProductGridWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[668px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{children}</div>
)

const ProductGridSkeleton = () => Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)

const ProductGridDataProvider = async ({
  initialSearchParams,
  children,
}: PropsWithChildren<{ initialSearchParams: Promise<SearchParams> }>) => {
  const queryParams = await loadProductSearchParams(initialSearchParams)
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: productQueryKey.base(queryParams),
    queryFn: ({ signal }) => fetchProducts(queryParams, signal),
    initialPageParam: queryParams._page,
  })
  await sleep(2_000)
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
}

export {
  ProductCard,
  ProductGridDataProvider,
  ProductGridSkeleton,
  ProductGridWrapper,
  ProductImage,
  ProductInfo,
  ProductLikeButton,
}
