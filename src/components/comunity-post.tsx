"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Post = {
    id: string;
    user: string;
    role: "admin" | "member";
    content: string;
    image?: string;
    createdAt: string;
};

export default function CommunityPost({ post }: { post: Post }) {
    const { user, role, content, image, createdAt } = post;
    const date = new Date(createdAt).toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
    });

    return (
        <Card className="border border-border bg-card/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl hover:shadow-sm transition">
            <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-muted dark:bg-zinc-800 rounded-full text-xs font-medium text-foreground">{user[0]}</div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-foreground">{user}</span>
                            <Badge variant={role === "admin" ? "default" : "secondary"} className="text-[10px] capitalize px-2 py-0">
                                {role}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground ml-auto">{date}</span>
                        </div>

                        <p className="mt-2 text-[13px] leading-relaxed text-foreground whitespace-pre-wrap">{content}</p>

                        {image && (
                            <div className="relative w-full h-56 sm:h-64 mt-3 overflow-hidden rounded-lg">
                                <Image src={image} alt="Post Image" fill className="object-cover transition-transform duration-200 hover:scale-105" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
