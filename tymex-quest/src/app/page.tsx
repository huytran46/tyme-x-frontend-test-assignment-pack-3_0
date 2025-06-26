import { Suspense } from 'react'
import type { SearchParams } from 'nuqs/server'

import { ProductGrid } from '@/app/components/product-grid/client'
import { Button } from '@/components/ui/button'

import { CategoryChips, CategoryChipsSkeleton, CategoryChipsWrapper } from './components/category-chips/server'
import { ProductFilterPanel } from './components/filters/product-filter-panel'
import { ProductGridWrapper } from './components/product-grid/server'
import { Aside, Footer, Header, Main } from './components/site-layout'

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
            <ProductGrid />
          </ProductGridWrapper>

          <div className="flex justify-center mt-8">
            <Button>View More</Button>
          </div>
        </section>
      </Main>
      <Footer />
    </div>
  )
}
