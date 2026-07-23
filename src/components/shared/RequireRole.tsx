"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types";
import { getDefaultRouteForRole } from "@/config/nav.config";


export function RequireRole({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace(getDefaultRouteForRole(user.role));
    }
  }, [isHydrated, user, allow, router]);

  if (!isHydrated || !user || !allow.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}