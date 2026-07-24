import type { Role } from "@/types";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export const MOCK_USERS: MockUser[] = [
  { id: "u1", name: "Patrick Mutua", email: "patrick@tujengepos.com", password: "patrick1234", role: "SUPER_ADMIN" },
  { id: "u2", name: "Halima Hassan", email: "halima@tujengepos.com", password: "halima1234", role: "ADMIN" },
  { id: "u3", name: "Nicholas Shayo", email: "nicholas@tujengepos.com", password: "nicholas1234", role: "STAFF" },
];


export const OTP_REQUIRED_FOR = ["patrick@tujengepos.com"];