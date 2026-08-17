"use client";

import { Pencil, ShoppingCart, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/Badge";
import { getStockStatus, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

export interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const stockTone: Record<ReturnType<typeof getStockStatus>, "success" | "warning" | "danger"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "danger",
};

export function ProductTable({ products, isLoading, onEdit, onDelete }: ProductTableProps) {
  const addItem = useCartStore((s) => s.addItem);

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      render: (product) => (
        <div>
          <div className="font-semibold text-navy-900">{product.name}</div>
          {product.description && (
            <div className="text-xs text-navy-400">{product.description}</div>
          )}
        </div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      render: (product) => <span className="font-mono text-xs text-navy-400">{product.sku}</span>,
    },
    {
      key: "supplierName",
      header: "Supplier",
      render: (product) => product.supplierName,
    },
    {
      key: "category",
      header: "Category",
      render: (product) => <Badge tone="brand">{product.category}</Badge>,
    },
    {
      key: "taxRate",
      header: "Tax",
      render: (product) => `${product.taxRate}%`,
    },
    {
      key: "price",
      header: "Price",
      render: (product) => (
        <span className="font-semibold text-navy-900">{formatCurrency(product.price)}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => {
        const status = getStockStatus(product.stock, product.lowStockThreshold);
        return <Badge tone={stockTone[status]}>{product.stock}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (product) => {
        const status = getStockStatus(product.stock, product.lowStockThreshold);
        const outOfStock = status === "out_of_stock";
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addItem(product)}
              disabled={outOfStock}
              aria-label={outOfStock ? "Out of stock" : `Add ${product.name} to cart`}
              className="rounded-lg p-1.5 text-navy-400 hover:bg-success-50 hover:text-success-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(product)}
              aria-label={`Edit ${product.name}`}
              className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(product)}
              aria-label={`Delete ${product.name}`}
              className="rounded-lg p-1.5 text-navy-400 hover:bg-danger-50 hover:text-danger-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={products}
      rowKey={(product) => product.id}
      isLoading={isLoading}
      emptyTitle="No products found"
      emptyDescription="Try a different search or filter, or add your first product."
    />
  );
}