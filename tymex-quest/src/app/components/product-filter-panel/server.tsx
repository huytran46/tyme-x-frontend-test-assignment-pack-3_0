import { Fragment, Suspense } from 'react'

import {
  PriceRangeSlider,
  PriceSelect,
  ResetFilterButton,
  SearchInput,
  ThemeSelect,
  TierSelect,
} from '@/app/components/product-filter-panel/client'
import { fetchAvailableCategories } from '@/app/data'

const MetaRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <span className="block mb-1 text-sm font-medium">{label}</span>
    {children}
  </div>
)

const ProductFilterPanel = async () => {
  const { tiers, themes, maxPrice } = await fetchAvailableCategories()
  return (
    <Fragment>
      {/* SEARCH */}
      <Suspense>
        <SearchInput />
      </Suspense>

      <MetaRow label="Price Range">
        <Suspense>
          <PriceRangeSlider max={maxPrice} />
        </Suspense>
      </MetaRow>

      <MetaRow label="Tier">
        <Suspense>
          <TierSelect tiers={tiers} />
        </Suspense>
      </MetaRow>

      <MetaRow label="Theme">
        <Suspense>
          <ThemeSelect themes={themes} />
        </Suspense>
      </MetaRow>

      <MetaRow label="Price">
        <Suspense>
          <PriceSelect />
        </Suspense>
      </MetaRow>

      <ResetFilterButton />
    </Fragment>
  )
}

export { ProductFilterPanel }
