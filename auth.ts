import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(
  (process.env.VERCEL === '1'
    ? process.env.POSTGRES_URL_NON_POOLING
    : process.env.POSTGRES_URL)!,
  {
    ssl: 'require',
    prepare: false,
    max: 1,
    idle_timeout: 20,
  }
);

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const users = await sql<User[]>`
          SELECT * FROM users WHERE email = ${email}
        `;

        const user = users[0];

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordsMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});