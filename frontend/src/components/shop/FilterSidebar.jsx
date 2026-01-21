import { ChevronDown, ChevronUp } from "lucide-react"

export default function FilterSidebar({ 
  categories,
  priceRanges,
  selectedCategory,
  selectedPriceRange,
  onCategoryChange,
  onPriceRangeChange,
  openFilters,
  onToggleFilter 
}) {
  // Filter Section Component
  const FilterSection = ({ title, name, children }) => (
    <div className="border-b border-[#e8e6e3]">
      <button
        onClick={() => onToggleFilter(name)}
        className="w-full flex items-center justify-between py-3 sm:py-4 group cursor-pointer"
      >
        <span className="text-[11px] sm:text-[12px] tracking-[0.15em] text-[#5c5c5c] group-hover:text-[#3e4026] transition-colors">
          {title}
        </span>
        {openFilters[name] ? (
          <ChevronUp size={13} className="sm:w-[14px] sm:h-[14px] text-[#8b8b8b]" />
        ) : (
          <ChevronDown size={13} className="sm:w-[14px] sm:h-[14px] text-[#8b8b8b]" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${openFilters[name] ? 'max-h-[500px] pb-4 sm:pb-5' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  )

  return (
    <aside className="w-full">
      <h2 className="text-[13px] sm:text-[14px] md:text-[15px] tracking-[0.15em] text-[#3e4026] mb-6 sm:mb-8 font-medium">FILTER</h2>
      
      {/* Category Filter */}
      <FilterSection title="CATEGORY" name="category">
        <div className="space-y-2.5 sm:space-y-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`block text-[11px] sm:text-[12px] tracking-[0.1em] transition-colors cursor-pointer active:scale-95 ${
                selectedCategory === cat.id 
                  ? 'text-[#3e4026] font-medium' 
                  : 'text-[#3e4026]/50 hover:text-[#3e4026]'
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection title="PRICE" name="price">
        <div className="space-y-2.5 sm:space-y-3">
          {priceRanges.map((r) => (
            <button
              key={r.id}
              onClick={() => onPriceRangeChange(r.id)}
              className={`block text-[11px] sm:text-[12px] tracking-[0.1em] active:scale-95 transition-all cursor-pointer ${
                selectedPriceRange === r.id 
                  ? 'text-[#3e4026] font-medium' 
                  : 'text-[#3e4026]/50 hover:text-[#3e4026]'
              }`}>
              {r.name}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  )
}
