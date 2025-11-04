"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

interface Post {
    id: string;
    content: string;
    authorId: string;
    author: {
        id: string;
        name: string;
        image: string;
        role: string;
    };
    createdAt: string;
    images?: Array<{ id: string; url: string }>;
    likes: Array<{ id: string; userId?: string }>;
    comments: Array<any>;
}

interface PostItemProps {
    post: Post;
    onLike: (id: string) => void;
    onCommentClick: (post: Post) => void;
    onDelete: (id: string) => void;
    togglingLikes: Record<string, boolean>;
    session: any;
}

export default function PostItem({ post, onLike, onCommentClick, onDelete, togglingLikes, session }: PostItemProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <Card className="transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <Avatar className="size-10">
                            <AvatarImage src={post.author.image} alt={post.author.name} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-font-primary dark:text-background flex items-center gap-2 text-lg font-semibold">
                                {post.author.name}
                                <span className={`rounded-full px-2 py-0.5 text-xs ${post.author.role === "admin" ? "bg-red-500/20 text-red-400 dark:bg-red-500/30 dark:text-red-300" : "bg-green-500/20 text-green-400 dark:bg-green-500/30 dark:text-green-300"}`}>{post.author.role}</span>
                            </CardTitle>
                            <p className="text-font-secondary text-sm dark:text-gray-400">{post.createdAt}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            {(post.authorId === session?.user.id || (session?.user as any).role === "admin") && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(post.id)}>
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <p className="text-font-primary dark:text-background mb-4">{post.content}</p>

                    {post.images && post.images.length > 0 && (
                        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                            {post.images.map((v, index) => (
                                <div key={v.id} className="relative aspect-video cursor-pointer overflow-hidden rounded-xl transition-opacity hover:opacity-90" onClick={() => setSelectedImage(v.url)}>
                                    <Image src={v.url} alt={`Post image ${v.id}`} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" priority={index === 0} placeholder="empty" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center space-x-6 text-sm">
                        <button onClick={() => onLike(post.id)} disabled={!!togglingLikes[post.id]} className={`flex items-center space-x-1 transition ${togglingLikes[post.id] ? "pointer-events-none opacity-50" : "hover:text-red-500"}`} aria-busy={!!togglingLikes[post.id]}>
                            <Heart className="h-4 w-4" />
                            <span>{post.likes.length}</span>
                        </button>
                        <button onClick={() => onCommentClick(post)} className="text-font-primary dark:text-background flex items-center space-x-1 transition hover:text-sky-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments.length}</span>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Image dialog */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedImage(null)}>
                    <div className="max-h-[90vh] max-w-4xl overflow-auto rounded-lg bg-white p-4 dark:bg-gray-900">
                        <Image src={selectedImage} alt="Full image" width={800} height={600} className="h-auto w-full rounded-lg" placeholder="empty" />
                    </div>
                </div>
            )}
        </>
    );
}
