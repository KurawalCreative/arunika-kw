import { GetServerSidePropsContext } from "next";
import { getServerSession, NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as any),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST || "smtp.mailtrap.io",
                port: parseInt(process.env.EMAIL_SERVER_PORT || "2525"),
                auth: {
                    user: process.env.EMAIL_SERVER_USER!,
                    pass: process.env.EMAIL_SERVER_PASSWORD!,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
            from: process.env.EMAIL_FROM || "noreply@arunika.com",
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                (session.user as any).id = user.id;
                (session.user as any).role = (user as any).role || "user";
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        verifyRequest: "/verify-request",
    },
};

export async function getServerAuthSession<Session>() {
    return await getServerSession(authOptions as any);
}
