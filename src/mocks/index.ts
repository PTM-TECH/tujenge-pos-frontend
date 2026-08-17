import MockAdapter from "axios-mock-adapter";
import type { AxiosInstance } from "axios";
import { registerAuthMocks } from "./handlers/auth";
import { registerSupplierMocks } from "./handlers/suppliers";
import { registerProductMocks } from "./handlers/products";
import { registerPurchaseMocks } from "./handlers/purchases";

export function enableMocks(axiosInstance: AxiosInstance) {
  const mock = new MockAdapter(axiosInstance, {
    delayResponse: 400,
    onNoMatch: "passthrough",
  });

  registerAuthMocks(mock);
  registerSupplierMocks(mock);
  registerProductMocks(mock);
  registerPurchaseMocks(mock);

  console.info(
    "%c[TujengePOS] Mock API active — src/mocks/",
    "color:#F97316;font-weight:bold;"
  );

  return mock;
}