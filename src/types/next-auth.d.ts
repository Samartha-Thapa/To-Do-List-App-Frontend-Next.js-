import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken?: string
  }

  interface Session {
    accessToken?: string
    user: DefaultSession["user"] & {
      id?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
  }
}
