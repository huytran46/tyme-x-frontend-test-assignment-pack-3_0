'use client'

import { useQueryStates } from 'nuqs'

import { productSearchParams } from '@/app/data'
import { useInfiniteProducts } from '@/app/hooks/use-infinite-products'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const PaginationSkeleton = () => (
  <Pagination className="pointer-events-none">
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" aria-disabled />
      </PaginationItem>
      {[1, 2, 3, 4].map(p => (
        <PaginationItem key={p}>
          <PaginationLink
            aria-disabled
            href="#"
            isActive={false}
            className="bg-gray-100 text-transparent animate-pulse"
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext href="#" aria-disabled />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)

const PaginationEmptyState = () => (
  <Pagination className="pointer-events-none">
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" aria-disabled />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#" aria-disabled />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)

const ProductGridPagination = () => {
  const [searchParams, setProductParams] = useQueryStates(productSearchParams)
  const { data, isLoading } = useInfiniteProducts(searchParams)
  const lastPage = data?.pages[data.pages.length - 1]

  if (isLoading) return <PaginationSkeleton />

  if (!lastPage?.data.length) return <PaginationEmptyState />

  const { total, limit, page } = lastPage
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return <PaginationSkeleton />

  const goToPage = (p: number) => setProductParams(prev => ({ ...prev, _page: p }))

  let pages: (number | 'ellipsis')[] = []
  if (totalPages <= 5) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  } else if (page <= 3) {
    pages = [1, 2, 3, 4, 'ellipsis', totalPages]
  } else if (page >= totalPages - 2) {
    pages = [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  } else {
    pages = [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages]
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={() => goToPage(Math.max(1, page - 1))} aria-disabled={page === 1} />
        </PaginationItem>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === page} onClick={() => goToPage(Number(p))}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { ProductGridPagination }
