"use client";

import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export interface CartPanelProps {
  transactionRef?: string;
  taxRateLabel?: string;
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export function CartPanel({
  transactionRef = "#TXN-NEW",
  taxRateLabel = "8.75%",
  onCheckout,
  isCheckingOut,
}: CartPanelProps) {
  const items = useCartStore((s) => s.items);
  const discount = useCartStore((s) => s.discount);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const taxTotal = useCartStore((s) => s.taxTotal());
  const total = useCartStore((s) => s.total());

  const isEmpty = items.length === 0;

  return (
    <aside className="flex h-screen w-[340px] shrink-0 flex-col border-l border-navy-100 bg-white">
      <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-navy-400" />
          <p className="label-caps">Order Cart</p>
        </div>
        <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-500">
          {transactionRef}
        </span>
      </div>
      <p className="px-5 pt-3 text-xs text-navy-400">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {isEmpty ? (
          <EmptyState
            icon={ShoppingCart}
            title="Cart is empty"
            description="Select products from the main panel"
            className="mt-16 border-none"
          />
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.productId} className="rounded-xl border border-navy-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-navy-900">{item.name}</p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="text-navy-300 hover:text-danger-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-lg bg-navy-50 px-1.5 py-1">
                    <button
                      onClick={() => decrementItem(item.productId)}
                      className="rounded-md p-1 hover:bg-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => incrementItem(item.productId)}
                      className="rounded-md p-1 hover:bg-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-navy-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-navy-100 p-5">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-navy-500">
            <span>Subtotal</span>
            <span className="font-medium text-navy-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-navy-500">
            <span>Tax ({taxRateLabel})</span>
            <span className="font-medium text-navy-900">{formatCurrency(taxTotal)}</span>
          </div>
          <div className="flex justify-between text-navy-500">
            <span>Discount</span>
            <span className="font-medium text-navy-900">
              {discount > 0 ? `-${formatCurrency(discount)}` : "—"}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-navy-100 pt-3">
          <span className="text-sm font-semibold text-navy-900">Total</span>
          <span className="text-xl font-bold text-navy-900">{formatCurrency(total)}</span>
        </div>
        <Button
          className="mt-4 w-full"
          size="lg"
          disabled={isEmpty}
          isLoading={isCheckingOut}
          onClick={onCheckout}
        >
          Complete Checkout
        </Button>
      </div>
    </aside>
  );
}