"use client";

import { useParams } from "next/navigation";

export default function page() {
    const params = useParams<{ provinsi: string }>();

    return <div>{params.provinsi}</div>;
}
