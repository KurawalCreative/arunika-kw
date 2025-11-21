"use client";

import { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {

    return (
        <main className="flex min-h-screen flex-col">
            {props.children}
        </main>
    );
}