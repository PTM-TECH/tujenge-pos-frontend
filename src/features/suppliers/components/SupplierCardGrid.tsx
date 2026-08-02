"use client";

import { Building2, Calendar, Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Supplier } from "@/types";

export interface SupplierCardGridProps {
  suppliers: Supplier[];
  isLoading?: boolean;
  onEdit: (supplier: Supplier) => void;
}

export function SupplierCardGrid({ suppliers, isLoading, onEdit }: SupplierCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-navy-100" />
        ))}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-navy-200 p-10 text-center">
        <h3 className="font-semibold text-navy-900">No suppliers yet</h3>
        <p className="mt-1 text-sm text-navy-400">
          Add your first vendor to start tracking orders and contacts.
        </p>
      </div>
    );
  }

  function handleContactClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {suppliers.map((supplier) => (
        <button
          key={supplier.id}
          type="button"
          onClick={() => onEdit(supplier)}
          className="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 text-left shadow-card transition-shadow hover:shadow-popover"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-500">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-navy-900">{supplier.name}</div>
              <Badge tone="brand" className="mt-0.5">
                {supplier.category}
              </Badge>
            </div>
          </div>

          <div className="space-y-1.5 text-sm text-navy-500">
            
              href={`tel:${supplier.phone}`}
              onClick={handleContactClick}
              className="flex items-center gap-2 hover:text-brand-600"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {supplier.phone}
            </a>
            
              href={`mailto:${supplier.email}`}
              onClick={handleContactClick}
              className="flex items-center gap-2 hover:text-brand-600"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {supplier.email}
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {supplier.address}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-navy-100 pt-3 text-xs text-navy-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Since {formatDate(supplier.since, { month: "short", year: "numeric" })}
            </span>
            <span className="font-semibold text-navy-600">{supplier.ordersCount} orders</span>
          </div>
        </button>
      ))}
    </div>
  );
}
