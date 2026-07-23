import { Sidebar } from "@/components/layout/Sidebar";
import { CartPanel } from "@/components/layout/CartPanel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-slate-50">
      <Sidebar />
      <main className="min-h-screen flex-1 overflow-y-auto p-8">{children}</main>
      <CartPanel />
    </div>
  );
}