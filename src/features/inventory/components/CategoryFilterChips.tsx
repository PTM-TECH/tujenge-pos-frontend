"use client";

import { cn } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

interface CategoryFilterChipsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilterChips({ selected, onSelect }: CategoryFilterChipsProps) {
  const options = ["All", ...PRODUCT_CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              isActive
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-navy-200 bg-white text-navy-500 hover:border-navy-300 hover:bg-navy-50"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}