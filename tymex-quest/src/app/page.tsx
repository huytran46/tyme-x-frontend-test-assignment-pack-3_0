import { Suspense } from 'react'
import type { SearchParams } from 'nuqs/server'

import { CategoryChips, CategoryChipsSkeleton, CategoryChipsWrapper } from '@/app/components/category-chips/server'
import { ProductFilterPanel } from '@/app/components/product-filter-panel/server'
import { ProductGrid } from '@/app/components/product-grid/client'
import { ProductGridSkeleton, ProductGridWrapper } from '@/app/components/product-grid/server'
import { ProductGridPagination } from '@/app/components/product-grid-pagination'
import { Aside, Footer, Header, Main } from '@/app/components/site-layout'

export default async function Page({}: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <Main>
        <Aside>
          <ProductFilterPanel />
        </Aside>

        <section className="flex-1 gap-6 flex flex-col">
          {/* Category Chips */}
          <CategoryChipsWrapper>
            <Suspense fallback={<CategoryChipsSkeleton />}>
              <CategoryChips />
            </Suspense>
          </CategoryChipsWrapper>

          {/* Product Grid */}
          <ProductGridWrapper>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid />
            </Suspense>
          </ProductGridWrapper>

          <ProductGridPagination />
        </section>
      </Main>

      <Footer />
    </div>
  )
}
