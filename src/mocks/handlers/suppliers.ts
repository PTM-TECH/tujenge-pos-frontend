import type MockAdapter from "axios-mock-adapter";
import type { Supplier } from "@/types";

let suppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Alpine Roasters",
    category: "Coffee",
    phone: "+1 (503) 442-8800",
    email: "orders@alpineroasters.com",
    address: "2218 NW Market St, Portland OR 97210",
    since: "2023-01-15",
    ordersCount: 24,
  },
  {
    id: "sup-2",
    name: "Northfield Glass Co.",
    category: "Equipment",
    phone: "+1 (206) 885-1200",
    email: "wholesale@northfieldglass.com",
    address: "5401 Airport Way S, Seattle WA 98108",
    since: "2023-03-02",
    ordersCount: 9,
  },
  {
    id: "sup-3",
    name: "Cascade Tea Works",
    category: "Tea",
    phone: "+1 (541) 774-9200",
    email: "supply@cascadetea.com",
    address: "890 Rossanley Dr, Medford OR 97501",
    since: "2023-06-10",
    ordersCount: 15,
  },
  {
    id: "sup-4",
    name: "BaristaSupply Inc.",
    category: "Equipment",
    phone: "+1 (415) 552-3300",
    email: "b2b@baristasupply.com",
    address: "444 De Haro St, San Francisco CA 94107",
    since: "2024-02-18",
    ordersCount: 18,
  },
  {
    id: "sup-5",
    name: "Sweet Syrups Co.",
    category: "Syrups",
    phone: "+1 (702) 383-0055",
    email: "trade@sweetsyrups.com",
    address: "3960 Howard Hughes Pkwy, Las Vegas NV 89169",
    since: "2023-08-05",
    ordersCount: 12,
  },
  {
    id: "sup-6",
    name: "Pacific Oat Farms",
    category: "Beverages",
    phone: "+1 (360) 491-7710",
    email: "wholesale@pacificoat.com",
    address: "1800 Cooper Point Rd SW, Olympia WA 98502",
    since: "2023-11-20",
    ordersCount: 7,
  },
];

export function registerSupplierMocks(mock: MockAdapter) {
  mock.onGet("/suppliers").reply(() => [200, suppliers]);

  mock.onPost("/suppliers").reply((config) => {
    const payload = JSON.parse(config.data);
    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      ordersCount: 0,
      since: new Date().toISOString().slice(0, 10),
      ...payload,
    };
    suppliers = [...suppliers, newSupplier];
    return [201, newSupplier];
  });

  mock.onPatch(/\/suppliers\/.+/).reply((config) => {
    const id = config.url!.split("/").pop();
    const payload = JSON.parse(config.data);
    suppliers = suppliers.map((s) => (s.id === id ? { ...s, ...payload } : s));
    const updated = suppliers.find((s) => s.id === id);
    return updated ? [200, updated] : [404, { message: "Supplier not found" }];
  });
}