const ProductCardSkeleton = () => (
  <div className="bg-white rounded shadow p-3 flex flex-col relative opacity-60">
    <div className="flex justify-end absolute top-2 right-2">
      <ProductTierBadge tier="--" />
    </div>
    <div className="w-full aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
      <span className="text-gray-400">Image</span>
    </div>
    <div className="flex-1">
      <div className="font-semibold bg-gray-100 text-transparent animate-pulse">Name</div>
      <div className="text-xs bg-gray-100 text-transparent animate-pulse">Tier</div>
      <div className="text-sm mt-1 bg-gray-100 text-transparent animate-pulse">0.00 ETH</div>
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
  <div className="bg-white rounded shadow p-3 flex flex-col relative">{children}</div>
)

const ProductTierBadge = ({ tier }: { tier: string }) => (
  <span
    style={{ fontSize: 10 }}
    className="px-1 rounded-md text-neutral-foreground bg-neutral-100 border border-neutral-300"
  >
    {tier}
  </span>
)

const ProductGridWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[668px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{children}</div>
)

const ProductGridSkeleton = () => Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)

const ProductGridEmptyState = () => (
  <div className="min-h-[400px] flex justify-center pt-20 col-span-1 sm:col-span-2 lg:col-span-4">
    <div className="flex flex-col items-center gap-3">
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-2 text-gray-300">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M8 15h8M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-gray-500 text-lg font-medium">No products found.</span>
      <span className="text-gray-400 text-sm text-center">Try adjusting your filters or search.</span>
    </div>
  </div>
)

export {
  ProductCard,
  ProductGridEmptyState,
  ProductGridSkeleton,
  ProductGridWrapper,
  ProductImage,
  ProductInfo,
  ProductLikeButton,
  ProductTierBadge,
}