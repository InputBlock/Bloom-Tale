import { ChevronDown, ChevronUp } from "lucide-react"

export default function FilterSidebar({ 
  categories,
  colours,
  priceRanges,
  selectedCategory,
  onCategoryChange,
  openFilters,
  onToggleFilter 
}) {
  // Filter Section Component
  const FilterSection = ({ title, name, children }) => (
    <div className="border-b border-[#e8e6e3]">
      <button
        onClick={() => onToggleFilter(name)}
        className="w-full flex items-center justify-between py-4 group"
      >
        <span className="text-[12px] tracking-[0.15em] text-[#5c5c5c] group-hover:text-[#3e4026] transition-colors">
          {title}
        </span>
        {openFilters[name] ? (
          <ChevronUp size={14} className="text-[#8b8b8b]" />
        ) : (
          <ChevronDown size={14} className="text-[#8b8b8b]" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${openFilters[name] ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  )

  return (
    <aside className="hidden lg:block w-52 flex-shrink-0">
      <h2 className="text-[15px] tracking-[0.15em] text-[#3e4026] mb-8 font-medium">FILTER</h2>
      
      {/* Category Filter */}
      <FilterSection title="CATEGORY" name="category">
        <div className="space-y-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`block text-[12px] tracking-[0.1em] transition-colors ${
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

      {/* Colour Filter */}
      <FilterSection title="COLOUR" name="colour">
        <div className="space-y-2">
          {colours.map((c) => (
            <button
              key={c.id}
              className="flex items-center gap-2 text-[11px] tracking-wider text-[#3e4026]/50 hover:text-[#3e4026] transition-colors"
            >
              <span 
                className="w-4 h-4 rounded-full border border-[#ddd] shadow-sm"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection title="PRICE" name="price">
        <div className="space-y-3">
          {priceRanges.map((r) => (
            <button
              key={r.id}
              className="block text-[12px] tracking-[0.1em] text-[#8b8b8b] hover:text-[#3e4026] transition-colors"
            >
              {r.name}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  )
}
