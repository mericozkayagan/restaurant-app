import NextAuth from 'next-auth';
// Instead of importing authOptions directly, we'll use a more basic config
// that doesn't directly reference Edge-incompatible code
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db/prisma';
import { UserRole } from '@prisma/client';

// Define a simplified version of authOptions that works everywhere
const authConfig: NextAuthConfig = {
  // Common config that works in both contexts
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // Set to false for local development
      },
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.log(`Auth failed: User not found - ${credentials.email}`);
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            console.log(`Auth failed: Password mismatch - ${credentials.email}`);
            return null;
          }

          console.log(`Auth success: ${credentials.email}, role: ${user.role}`);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log(`Auth callback: User authorized: ${isLoggedIn}`);
      return isLoggedIn;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log(`JWT callback: Setting token for user ${user.email}`);
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        console.log(`Session callback: Setting session for user ${session.user.email}`);
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut() {
      console.log("User signed out");
    },
    async session({ session, token }) {
      console.log(`Session accessed: ${session?.user?.email}`);
    },
  },
  debug: true, // Always enable debug for troubleshooting
};

// Export auth functions with proper Next.js App Router support
export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);