"use client";

import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer";
import { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

export default function Layout(props: { children: ReactNode }) {
    const pathname = usePathname();
    const showFooter = !pathname.startsWith("/komunitas");

    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 pt-16">
                <div className="flex flex-1">
                    <>{props.children}</>
                </div>
            </div>
            {showFooter && <FooterSection />}
        </main>
    );
}
