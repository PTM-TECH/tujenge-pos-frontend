function base64url(input: object): string {
  const json = JSON.stringify(input);
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function createMockJwt(payload: Record<string, unknown>, expiresInSeconds = 60 * 15): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const signature = "mock-signature-not-for-verification";
  return `${base64url(header)}.${base64url(fullPayload)}.${btoa(signature)}`;
}