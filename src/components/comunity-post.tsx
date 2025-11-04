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
        <Card className="border-border bg-card/90 rounded-xl border backdrop-blur-md transition hover:shadow-sm dark:bg-zinc-900/80">
            <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="bg-muted text-foreground flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium sm:h-10 sm:w-10 dark:bg-zinc-800">{user[0]}</div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-foreground text-sm font-medium">{user}</span>
                            <Badge variant={role === "admin" ? "default" : "secondary"} className="px-2 py-0 text-[10px] capitalize">
                                {role}
                            </Badge>
                            <span className="text-muted-foreground ml-auto text-[11px]">{date}</span>
                        </div>

                        <p className="text-foreground mt-2 text-[13px] leading-relaxed whitespace-pre-wrap">{content}</p>

                        {image && (
                            <div className="relative mt-3 h-56 w-full overflow-hidden rounded-lg sm:h-64">
                                <Image src={image} alt="Post Image" fill className="object-cover transition-transform duration-200 hover:scale-105" placeholder="empty" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
