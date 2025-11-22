"use client";

import { ReactNode } from "react";
import AppSidebar from "@/components/app-sidebar";
import AppRightSidebar from "@/components/app-right-sidebar";
import NavbarArunika from "@/components/navbar";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* <div className="flex min-h-screen flex-1 bg-white transition-colors dark:bg-slate-950"> */}
            <div className="flex h-screen min-h-screen flex-1 flex-col pt-16 lg:flex-row">
                <AppSidebar />
                <NavbarArunika />
                {/* <main className="flex-1 px-4 sm:px-6 lg:px-8"> */}
                <>{children}</>
                {/* </main> */}
                <AppRightSidebar />
            </div>
            {/* </div> */}
        </>
    );
}
