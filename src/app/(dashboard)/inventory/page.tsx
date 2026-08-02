"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/features/inventory/hooks";
import { ProductTable } from "@/features/inventory/components/ProductTable";
import { AddProductModal } from "@/features/inventory/components/AddProductModal";
import { LowStockBanner } from "@/features/inventory/components/LowStockBanner";
import { CategoryFilterChips } from "@/features/inventory/components/CategoryFilterChips";
import type { Product } from "@/types";
import type { ProductFormValues } from "@/lib/validators";

export default function InventoryPage() {
  const { data: products = [], isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  function handleAddClick() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function handleEditClick(product: Product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  function handleSubmit(values: ProductFormValues) {
    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, payload: values },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => setModalOpen(false) });
    }
  }

  function handleConfirmDelete() {
    if (!deletingProduct) return;
    deleteMutation.mutate(deletingProduct.id, { onSuccess: () => setDeletingProduct(null) });
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <Topbar
          title="Inventory"
          description={`${filtered.length} products · ${filtered.reduce(
            (sum, p) => sum + p.stock,
            0
          )} units in stock`}
        />
        <Button onClick={handleAddClick} className="shrink-0">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <LowStockBanner products={products} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by product name, SKU, or description…"
            className="w-full rounded-xl border border-navy-200 py-2 pl-9 pr-3 text-sm text-navy-700 placeholder:text-navy-400 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <CategoryFilterChips selected={category} onSelect={setCategory} />
      </div>

      <Card className="p-0">
        <ProductTable
          products={filtered}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={setDeletingProduct}
        />
      </Card>

      <AddProductModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialProduct={editingProduct}
      />

      <ConfirmDialog
        open={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${deletingProduct?.name}"?`}
        confirmLabel="Delete Product"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}