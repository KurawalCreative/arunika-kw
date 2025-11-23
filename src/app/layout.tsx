import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "@/components/next-auth-session-provider";
import SmoothScroll from "@/components/smooth-scroll";

const manrope = Manrope({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Arunika | Jelajahi Nusantara",
    description: "Petakan budaya Indonesia dengan peta interaktif, cerita provinsi, dan inspirasi komunitas dari Arunika.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className={`${manrope.className} dark:bg-neutral-900 text-font-primary dark:text-neutral-100 antialiased`}>
                <NextAuthProvider>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                        <SmoothScroll />
                        {children}
                    </ThemeProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
