"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, MoreHorizontal, UserPlus, UserMinus } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    likesCount: number;
    likedByUser?: boolean;
    comments?: Array<any>; // Optional - loaded on demand
    commentCount?: number; // Comment count for display
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
    const [isFollowing, setIsFollowing] = useState(false);
    const [togglingFollow, setTogglingFollow] = useState(false);

    // Safely read runtime-only fields that NextAuth attaches to session.user
    const user = (session?.user as any) || {};
    const userId = user.id as string | undefined;
    const userRole = user.role as string | undefined;

    const isOwnPost = post.authorId === userId;

    useEffect(() => {
        if (userId && !isOwnPost) {
            checkFollowStatus();
        }
    }, [userId, post.authorId]);

    const checkFollowStatus = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`/api/komunitas/follow/check?followerId=${userId}&followingId=${post.authorId}`);
            setIsFollowing(res.data.isFollowing);
        } catch (err) {
            console.error("Failed to check follow status:", err);
        }
    };

    const handleFollow = async () => {
        if (!userId || togglingFollow) return;

        setTogglingFollow(true);
        try {
            if (isFollowing) {
                await axios.delete(`/api/komunitas/follow`, {
                    data: { followingId: post.authorId },
                });
                setIsFollowing(false);
            } else {
                await axios.post(`/api/komunitas/follow`, { followingId: post.authorId });
                setIsFollowing(true);
            }
        } catch (err) {
            console.error("Failed to toggle follow:", err);
        } finally {
            setTogglingFollow(false);
        }
    };

    return (
        <>
            <Card className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${post.authorId === userId ? "ring-2 ring-blue-500/20" : ""}`}>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <Link href={`/komunitas/profile/${post.authorId}`} className="flex items-center space-x-3 transition-opacity hover:opacity-80">
                            <Avatar className="size-10">
                                <AvatarImage src={post.author.image} alt={post.author.name} />
                                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-font-primary dark:text-background flex items-center gap-2 text-lg font-semibold">
                                    {post.author.name}
                                    {isOwnPost && <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-500/30 dark:text-blue-300">Anda</span>}
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${post.author.role === "admin" ? "bg-red-500/20 text-red-400 dark:bg-red-500/30 dark:text-red-300" : "bg-green-500/20 text-green-400 dark:bg-green-500/30 dark:text-green-300"}`}>{post.author.role}</span>
                                    {!isOwnPost && session && (
                                        <button
                                            onClick={handleFollow}
                                            disabled={togglingFollow}
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${isFollowing ? "bg-gray-500/20 text-gray-600 hover:bg-gray-500/30 dark:bg-gray-500/30 dark:text-gray-300" : "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 dark:bg-blue-500/30 dark:text-blue-300"} ${togglingFollow ? "animate-pulse" : ""}`}
                                        >
                                            {togglingFollow ? (
                                                <div className="inline-flex h-2 w-2 animate-spin rounded-full border border-current border-t-transparent" />
                                            ) : isFollowing ? (
                                                <span className="flex items-center gap-1">
                                                    <UserMinus className="h-3 w-3" />
                                                    Following
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <UserPlus className="h-3 w-3" />
                                                    Follow
                                                </span>
                                            )}
                                        </button>
                                    )}
                                </CardTitle>
                                <p className="text-font-secondary text-sm dark:text-gray-400">{post.createdAt}</p>
                            </div>
                        </Link>
                        <div className="ml-auto flex items-center gap-2">
                            {(isOwnPost || userRole === "admin") && (
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
                </CardHeader>{" "}
                <CardContent>
                    <p className="text-font-primary dark:text-background mb-4">{post.content}</p>

                    {post.images && post.images.length > 0 && (
                        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                            {post.images.map((v, index) => (
                                <div key={v.id} className="relative aspect-video cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg" onClick={() => setSelectedImage(v.url)}>
                                    <Image src={v.url} alt={`Post image ${v.id}`} fill className="object-cover transition-transform duration-300 hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" priority={index === 0} placeholder="empty" />
                                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 hover:bg-black/10" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center space-x-6 text-sm">
                        <button onClick={() => onLike(post.id)} disabled={!!togglingLikes[post.id]} className={`flex items-center space-x-1 transition-all duration-200 hover:scale-110 active:scale-95 ${togglingLikes[post.id] ? "pointer-events-none animate-pulse opacity-50" : "hover:text-red-500"}`} aria-busy={!!togglingLikes[post.id]}>
                            <Heart className={`h-4 w-4 transition-all duration-200 ${post.likedByUser ? "scale-110 fill-red-500 text-red-500" : ""}`} />
                            <span className={`transition-colors duration-200 ${post.likedByUser ? "text-red-500" : ""}`}>{post.likesCount}</span>
                        </button>
                        <button onClick={() => onCommentClick(post)} className="text-font-primary dark:text-background flex items-center space-x-1 transition-all duration-200 hover:scale-110 hover:text-sky-500 active:scale-95">
                            <MessageCircle className={`h-4 w-4 transition-all duration-200 ${(post.commentCount || 0) > 0 ? "text-sky-500" : ""}`} />
                            <span className={`transition-colors duration-200 ${(post.commentCount || 0) > 0 ? "text-sky-500" : ""}`}>{post.commentCount || 0}</span>
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
