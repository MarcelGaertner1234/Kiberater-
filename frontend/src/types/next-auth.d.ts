import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      email: string
      name?: string | null
      image?: string | null
    }
    accessToken?: string
    refreshToken?: string
  }

  interface User extends DefaultUser {
    role: string
    accessToken?: string
    refreshToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    accessToken?: string
    refreshToken?: string
  }
}