import { Coffee, CupSoda, Leaf, Settings, type LucideIcon } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useProductCategories } from "../hooks";
import type { ProductCategory } from "../types";

const ICON_MAP: Record<string, LucideIcon> = {
  coffee: Coffee,
  "cup-soda": CupSoda,
  leaf: Leaf,
  settings: Settings,
};

const TONE_BY_CATEGORY: Record<string, string> = {
  coffee: "bg-warning-50 text-warning-600",
  beverages: "bg-brand-50 text-brand-600",
  tea: "bg-success-50 text-success-600",
  equipment: "bg-navy-50 text-navy-600",
  syrups: "bg-danger-50 text-danger-600",
  snacks: "bg-warning-100 text-warning-700",
  merch: "bg-purple-50 text-purple-600",
  accessories: "bg-cyan-50 text-cyan-600",
};

const DEFAULT_TONE = "bg-navy-50 text-navy-600";

interface CategoryCardProps {
  category: ProductCategory;
  onClick?: (id: string) => void;
}

function CategoryCard({ category, onClick }: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon] ?? Coffee;
  const tone = TONE_BY_CATEGORY[category.id] ?? DEFAULT_TONE;
  const isPositive = category.growthPct >= 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(category.id);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(category.id)}
      onKeyDown={handleKeyDown}
      className="flex flex-col items-start gap-3 text-left transition hover:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
    >
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tone)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-navy-900">{category.name}</p>
        <p className="text-xs text-navy-400">{category.productCount} products</p>
      </div>
      <div className="flex w-full items-center justify-between text-xs">
        <span className="text-navy-500">{category.sold} sold</span>
        <span className={cn("font-semibold", isPositive ? "text-success-600" : "text-danger-500")}>
          {isPositive ? "+" : ""}
          {category.growthPct}%
        </span>
      </div>
    </Card>
  );
}

interface ProductCategoriesGridProps {
  onSelectCategory?: (id: string) => void;
}

export function ProductCategoriesGrid({ onSelectCategory }: ProductCategoriesGridProps) {
  const { data, isLoading, error } = useProductCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-sm text-danger-500">Failed to load product categories.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-navy-900">Product Categories</h3>
        <p className="text-xs text-navy-400">Click a category to filter products</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={onSelectCategory}
          />
        ))}
      </div>
    </div>
  );
}