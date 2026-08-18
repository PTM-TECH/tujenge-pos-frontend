import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useOutstandingBalances } from "../hooks";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function OutstandingBalancesTable() {
  const { data, isLoading, error } = useOutstandingBalances();

  if (isLoading) {
    return <Skeleton className="h-72 w-full rounded-2xl" />;
  }

  if (error || !data) {
    return (
      <Card>
        <p className="text-sm text-danger-500">Failed to load outstanding balances.</p>
      </Card>
    );
  }

  const totalOwed = data.reduce((sum, row) => sum + row.balanceDue, 0);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-navy-900">Outstanding Balances</h3>
          <p className="text-sm text-navy-400">Customers who paid less than the sale total</p>
        </div>
        <span className="rounded-full bg-danger-50 px-3 py-1 text-xs font-semibold text-danger-500">
          {formatCurrency(totalOwed)} owed
        </span>
      </div>

      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-navy-400">No outstanding balances.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Sale Ref</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium text-right">Sale Total</th>
                <th className="pb-2 font-medium text-right">Paid</th>
                <th className="pb-2 font-medium text-right">Balance Due</th>
                <th className="pb-2 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-navy-50 last:border-0">
                  <td className="py-3 font-medium text-navy-900">{row.customerName}</td>
                  <td className="py-3 text-navy-500">{row.saleRef}</td>
                  <td className="py-3 text-navy-500">{row.date}</td>
                  <td className="py-3 text-right text-navy-900">{formatCurrency(row.saleTotal)}</td>
                  <td className="py-3 text-right text-success-600">{formatCurrency(row.paid)}</td>
                  <td className="py-3 text-right font-semibold text-danger-500">{formatCurrency(row.balanceDue)}</td>
                  <td className="py-3 text-right">
                    <button className="rounded-lg border border-success-200 px-3 py-1 text-xs font-medium text-success-600 transition hover:bg-success-50">
                      Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}