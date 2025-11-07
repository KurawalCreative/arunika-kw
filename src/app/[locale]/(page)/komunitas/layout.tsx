"use client";

import { ReactNode } from "react";
import AppSidebar from "@/components/app-sidebar";
import AppRightSidebar from "@/components/app-right-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-16 transition-colors">
            <div className="flex flex-row min-h-screen relative">
                <AppSidebar />
                <main className="flex-1 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
                <AppRightSidebar />
            </div>
        </div>
    );
}
