import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Truck,
  Users,
  UserCog,
  Percent,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

// Single source of truth for sidebar navigation.
// Role is decoded from the JWT at login and never chosen by the user.

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "New Sale",
    href: "/new-sale",
    icon: ShoppingCart,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
  },
  {
    label: "Sales Log",
    href: "/sales-log",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
  },
  {
    label: "Purchases",
    href: "/purchases",
    icon: Truck,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "Suppliers",
    href: "/suppliers",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "User Management",
    href: "/user-management",
    icon: UserCog,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Tax Rates",
    href: "/tax-rates",
    icon: Percent,
    roles: ["SUPER_ADMIN"],
  },
];

export function getNavForRole(role: Role | undefined): NavItem[] {
  if (!role) return [];
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

// First route a role should land on after login.
export function getDefaultRouteForRole(role: Role): string {
  if (role === "STAFF") return "/new-sale";
  return "/dashboard";
}