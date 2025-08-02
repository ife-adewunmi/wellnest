// src/shared/types/auth.ts

declare module "next-auth" {
  interface Session {
    user: User
  }

  interface User {
    role: "STUDENT" | "COUNSELOR"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "STUDENT" | "COUNSELOR"
  }
}
