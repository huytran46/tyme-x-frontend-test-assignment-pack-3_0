import { Fragment } from 'react'

import { ProductNameSearch } from '@/app/components/filters/product-name-search'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

const MetaRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <span className="block mb-1 text-sm font-medium">{label}</span>
    {children}
  </div>
)

const ProductFilterPanel = () => (
  <Fragment>
    {/* SEARCH */}
    <ProductNameSearch />

    <MetaRow label="Price Range">
      <Slider className="w-full" />
    </MetaRow>

    <MetaRow label="Tier">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue className="text-sm text-gray-500" placeholder="Select a tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="tier-1">Tier 1</SelectItem>
          <SelectItem value="tier-2">Tier 2</SelectItem>
        </SelectContent>
      </Select>
    </MetaRow>

    <MetaRow label="Theme">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue className="text-sm text-gray-500 w-full" placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="theme-1">Theme 1</SelectItem>
          <SelectItem value="theme-2">Theme 2</SelectItem>
        </SelectContent>
      </Select>
    </MetaRow>

    <MetaRow label="Price">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue className="text-sm text-gray-500 w-full" placeholder="Select a price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="low-to-high">Low to High</SelectItem>
          <SelectItem value="high-to-low">High to Low</SelectItem>
        </SelectContent>
      </Select>
    </MetaRow>

    <Button variant="outline" className="w-full">
      Reset Filter
    </Button>
  </Fragment>
)

export { ProductFilterPanel }
