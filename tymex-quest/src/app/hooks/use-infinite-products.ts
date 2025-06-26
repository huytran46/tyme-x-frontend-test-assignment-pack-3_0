'use client'

import { productFetcher, productQueryKey, ProductQueryParams } from '@/app/data'

import { useInfiniteQuery } from '@tanstack/react-query'

const useInfiniteProducts = (params: ProductQueryParams) =>
  useInfiniteQuery({
    queryKey: productQueryKey.base(params),
    queryFn: async ({ signal }) => productFetcher(params, signal),
    getNextPageParam: lastPage => (lastPage.data.length < lastPage.limit ? undefined : lastPage.page + 1),
    initialPageParam: params._page,
  })

export { useInfiniteProducts }
