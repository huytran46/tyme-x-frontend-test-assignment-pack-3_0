'use client'

import { useQueryStates } from 'nuqs'

import { productSearchParams } from '@/app/data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CategoryChip = ({ cat }: { cat: string }) => {
  const [productParams, setProductParams] = useQueryStates(productSearchParams)
  const isSelected = productParams.category?.includes(cat)
  const handleClick = (selectedCategory: string) => {
    setProductParams(prev => {
      if (!prev.category) return { ...prev, category: [selectedCategory] }
      
      const nextCategories = prev.category.includes(selectedCategory)
        ? prev.category.filter(c => c !== selectedCategory)
        : prev.category.concat(selectedCategory)

      if (!nextCategories.length) return { ...prev, category: null }
      
      return { ...prev, category: nextCategories }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        isSelected &&
          'bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-none',
      )}
      onClick={() => handleClick(cat)}
    >
      {cat}
    </Button>
  )
}

export { CategoryChip }
