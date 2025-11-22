"use client";

import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const provinsi = params.provinsi;

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full flex-1 flex-col p-4">
            <div className="w-full max-w-7xl"></div>
        </div>
    );
}
