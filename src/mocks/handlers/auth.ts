import type MockAdapter from "axios-mock-adapter";
import { MOCK_USERS, OTP_REQUIRED_FOR } from "../users";
import { createMockJwt } from "../fakeJwt";

const REFRESH_COOKIE = "refresh_token";
const USER_COOKIE = "mock_user_id";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setMockSession(userId: string) {
  
  document.cookie = `${REFRESH_COOKIE}=mock-session; path=/; max-age=604800`;
  document.cookie = `${USER_COOKIE}=${userId}; path=/; max-age=604800`;
}

function clearMockSession() {
  document.cookie = `${REFRESH_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${USER_COOKIE}=; path=/; max-age=0`;
}

function tokenFor(user: (typeof MOCK_USERS)[number]) {
  return createMockJwt({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export function registerAuthMocks(mock: MockAdapter) {
  mock.onPost("/auth/login").reply((config) => {
    const { email, password } = JSON.parse(config.data);
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!user) return [401, { message: "Invalid email or password" }];

    if (OTP_REQUIRED_FOR.includes(user.email)) {
      sessionStorage.setItem("mock_pending_user", user.id);
      return [200, { requiresOtp: true }];
    }

    setMockSession(user.id);
    return [200, { accessToken: tokenFor(user) }];
  });

  mock.onPost("/auth/verify-otp").reply(() => {
    const pendingId = sessionStorage.getItem("mock_pending_user");
    const user = MOCK_USERS.find((u) => u.id === pendingId) ?? MOCK_USERS[0];
    sessionStorage.removeItem("mock_pending_user");
    setMockSession(user.id);
    return [200, { accessToken: tokenFor(user) }];
  });

  mock.onPost("/auth/refresh").reply(() => {
    const userId = getCookie(USER_COOKIE);
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) return [401, { message: "No active mock session" }];
    return [200, { accessToken: tokenFor(user) }];
  });

  mock.onPost("/auth/logout").reply(() => {
    clearMockSession();
    return [200, {}];
  });

  mock.onPost("/auth/forgot-password").reply(() => {
    return [200, { message: "If that email exists, reset instructions were sent." }];
  });
}