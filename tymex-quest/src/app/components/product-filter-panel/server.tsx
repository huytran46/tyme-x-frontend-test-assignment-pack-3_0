import { Fragment, Suspense } from 'react'

import { PriceSelect, SearchInput, ThemeSelect, TierSelect } from '@/app/components/product-filter-panel/client'
import { fetchAvailableCategories } from '@/app/data'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { sleep } from '@/lib/utils'

const MetaRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <span className="block mb-1 text-sm font-medium">{label}</span>
    {children}
  </div>
)

const ProductFilterPanel = async () => {
  const { tiers, themes } = await fetchAvailableCategories()
  await sleep(2_000)
  return (
    <Fragment>
      {/* SEARCH */}
      <Suspense>
        <SearchInput />
      </Suspense>

      <MetaRow label="Price Range">
        <Slider className="w-full" />
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

      <Button variant="outline" className="w-full">
        Reset Filter
      </Button>
    </Fragment>
  )
}

export { ProductFilterPanel }
