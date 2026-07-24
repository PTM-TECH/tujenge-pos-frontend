import MockAdapter from "axios-mock-adapter";
import type { AxiosInstance } from "axios";
import { registerAuthMocks } from "./handlers/auth";

export function enableMocks(axiosInstance: AxiosInstance) {
  const mock = new MockAdapter(axiosInstance, {
    delayResponse: 400, 
    onNoMatch: "passthrough",
  });

  registerAuthMocks(mock);

  console.info(
    "%c[TujengePOS] Mock API active — src/mocks/",
    "color:#F97316;font-weight:bold;"
  );

  return mock;
}