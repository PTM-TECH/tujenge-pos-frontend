"use client";

import { Circle } from "lucide-react";

export function Topbar({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-navy-400">{description}</p>}
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1.5 text-xs font-semibold text-success-600">
        <Circle className="h-2 w-2 fill-current" />
        Store open
      </div>
    </div>
  );
}