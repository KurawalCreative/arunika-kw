"use client";

import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer";
import { ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation";
import RaniChatCompanion from "@/components/rani-chat-companion";

export default function Layout(props: { children: ReactNode }) {
    const pathname = usePathname();
    const showFooter = !/^\/(komunitas|jelajahi-nusantara)/.test(pathname);

    return (
        <main className="flex min-h-screen flex-col">
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            <div className="flex flex-1 pt-16">
                <div className="flex flex-1 flex-col">
                    <>
                        {props.children}
                        <RaniChatCompanion />
                    </>
                </div>
            </div>
            {showFooter && <FooterSection />}
        </main>
    );
}
