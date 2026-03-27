import { CATEGORIES, Category } from "@/lib/types";

interface CategoryFilterProps {
  selected: Category;
  onSelect: (cat: Category) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => (
  <div className="flex flex-wrap gap-2">
    {CATEGORIES.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
          selected === cat
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
            : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
