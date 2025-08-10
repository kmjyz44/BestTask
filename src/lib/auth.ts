
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './prisma'
import EmailProvider from 'next-auth/providers/email'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'database' },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD }
      },
      from: process.env.EMAIL_FROM
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || ''
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = user.id;
        // @ts-ignore
        session.user.role = user.role;
      }
      return session
    }
  }
})
