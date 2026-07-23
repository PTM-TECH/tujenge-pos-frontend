"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
        },
      })
  );

  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  // On first load, attempt a silent refresh so a returning user with a valid
  // refresh_token cookie doesn't get bounced to /login unnecessarily.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.post<{ accessToken: string }>("/auth/refresh");
        if (!cancelled) setAccessToken(data.accessToken);
      } catch {
        // No valid session — that's fine, middleware/RequireRole will redirect.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}