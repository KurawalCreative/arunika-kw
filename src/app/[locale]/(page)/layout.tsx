"use client";

import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer";
import { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 pt-16">
                <div className="flex flex-1">
                    <>{props.children}</>
                </div>
            </div>
            <FooterSection />
        </main>
    );
}
