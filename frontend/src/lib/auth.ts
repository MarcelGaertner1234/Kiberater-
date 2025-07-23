import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          role: 'user',
          locale: 'de',
          timezone: 'Europe/Berlin',
        }
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call backend API for authentication
          const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await response.json()

          if (!response.ok || !data.success) {
            return null
          }

          // Return user data for session
          return {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.name,
            image: data.data.user.avatarUrl,
            role: data.data.user.role,
            accessToken: data.data.tokens.accessToken,
            refreshToken: data.data.tokens.refreshToken,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // For OAuth providers, create user in backend
      if (isNewUser && account?.provider === 'google') {
        try {
          await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/auth/oauth-register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
            }),
          })
        } catch (error) {
          console.error('Error creating OAuth user:', error)
        }
      }
    },
  },
}
