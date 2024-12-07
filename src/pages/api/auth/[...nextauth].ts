import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { User } from "next-auth";
import { Session } from "next-auth";
import prisma from "@/app/libs/prismadb";

interface CustomUser extends User {
    role?: string;
}
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                // First check admin
                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email }
                });

                if (admin) {
                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        admin.hashedPassword
                    );
                    if (isCorrectPassword) {
                        return {
                            id: admin.id,
                            email: admin.email,
                            role: 'admin'
                        };
                    }
                }

                // If not admin, check regular user
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }

                return {
                    ...user,
                    role: 'user'
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT & { role?: string }, user: any }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT & { role?: string } }) {
            if (session?.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/admin',
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);


