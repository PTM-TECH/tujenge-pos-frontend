"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, LogOut } from "lucide-react";
import { getNavForRole } from "@/config/nav.config";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME, APP_TAGLINE, ROLE_LABELS } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const navItems = getNavForRole(user?.role);

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-navy-800 bg-navy-900 px-4 py-5 text-white">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
          <ShoppingBag className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">{APP_NAME}</p>
          <p className="text-xs leading-tight text-navy-300">{APP_TAGLINE}</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1">
        <p className="label-caps px-2 pb-2 text-navy-400">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-500 text-white"
                  : "text-navy-300 hover:bg-navy-800 hover:text-white"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="mt-4 border-t border-navy-800 pt-4">
          <div className="flex items-center gap-2.5 px-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
              {initials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-navy-400">{user.email}</p>
            </div>
          </div>
          <span className="ml-2 mt-2 inline-block rounded-full bg-brand-500/15 px-2 py-0.5 text-[11px] font-semibold text-brand-400">
            {ROLE_LABELS[user.role]}
          </span>
          <button
            onClick={logout}
            className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}