export const userRole = {
  ADMIN: "ADMIN",
  EXAMINER: "EXAMINER",
  EXAMINEE: "EXAMINEE",
} as const;

export const userStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING: "PENDING",
} as const;

export type UserRole = keyof typeof userRole;
export type UserStatus = keyof typeof userStatus;
