import { CategoryChip } from '@/app/components/category-chips/client'
import { fetchAvailableCategories } from '@/app/data'
import { sleep } from '@/lib/utils'

const CategoryChipsWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-8 flex flex-wrap gap-2">{children}</div>
)

const CategoryChips = async () => {
  const { categories } = await fetchAvailableCategories()
  await sleep(2_000)
  return categories.map(cat => <CategoryChip key={cat} cat={cat} />)
}

const CategoryChipsSkeleton = () =>
  Array.from({ length: 6 }).map((_, i) => <span key={i} className="bg-gray-200 rounded-md w-16 h-8 animate-pulse" />)

export { CategoryChips, CategoryChipsSkeleton, CategoryChipsWrapper }
