"use client";

import Image from "next/image";
import { ArrowLeft, Forward, Heart, Loader2, MessageCircle, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CommentInput from "./comment-input";
import { Session } from "next-auth";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRouter } from "next/navigation";

interface CommentHeaderProps {
    post: any;
    onlike: () => void;
    loadingLike: boolean;
    session: Session | null;
    commentInput: string;
    setCommentInput: (value: string) => void;
    onPostComment: () => void;
    loadingComment: boolean;
}

export default function CommentHeader({ post, onlike, loadingLike, session, commentInput, setCommentInput, onPostComment, loadingComment }: CommentHeaderProps) {
    const [openMenu, setOpenMenu] = useState(false);
    const [copy, setCopy] = useState(false);
    const router = useRouter();

    const handleCopy = () => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                setCopy(true);
                setTimeout(() => setCopy(false), 2000);
            })
            .catch((err) => {
                console.error("Gagal menyalin link: ", err);
            });
    };

    if (!post) return null;

    return (
        <>
            <button onClick={() => router.back()} className="mb-6 flex w-fit cursor-pointer items-center gap-3 p-0.5 text-3xl font-bold text-gray-900 dark:text-white">
                <ArrowLeft size={26} /> Post
            </button>

            <div className="rounded-lg bg-white p-4 dark:bg-slate-800/50">
                {/* Header Post */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image width={40} height={40} src={post.author.image || "/default-avatar.png"} alt={post.author.name || ""} className="rounded-full" />
                        <div>
                            <p className="font-semibold">{post.author.name}</p>
                            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Konten Post */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose dark:prose-invert wrap-break-words mb-4 overflow-hidden break-all" />

                {/* Images */}
                {post.images?.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {post.images.map((img: any, idx: number) => (
                            <Image key={idx} src={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${img.url}`} alt="Post image" width={300} height={200} className="rounded-lg object-cover" />
                        ))}
                    </div>
                )}

                {/* Input Komentar */}
                <CommentInput authorImage={session?.user?.image || "/default-avatar.png"} authorName={session?.user?.name || "User"} value={commentInput} onChange={setCommentInput} onSubmit={onPostComment} loading={loadingComment} />

                {/* Actions */}
                <div className="flex items-center justify-start gap-3 pt-4">
                    {/* Like Button */}
                    <button
                        onClick={onlike}
                        disabled={loadingLike}
                        aria-label={post.isLikedByUser ? "Un-like post" : "Like post"}
                        className={`group flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${post.isLikedByUser ? "bg-accent-coral/10 text-accent-coral dark:bg-accent-coral/15" : "hover:bg-accent-coral/10 hover:text-accent-coral-hover dark:hover:bg-accent-coral/10 dark:hover:text-accent-coral-hover text-gray-500 dark:text-slate-400"} `}
                    >
                        {loadingLike ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 transition-colors ${post.isLikedByUser ? "fill-accent-coral text-accent-coral" : "group-hover:text-accent-coral-hover dark:group-hover:text-accent-coral-hover text-gray-500 dark:text-slate-400"}`} />}
                        <span className={`text-sm font-medium transition-colors ${post.isLikedByUser ? "text-accent-coral" : "text-gray-500 dark:text-slate-400"}`}>{post._count.likes}</span>
                    </button>

                    {/* Comment Button */}
                    <Tooltip>
                        <TooltipTrigger>
                            <div className={`group hover:bg-primary-blue/10 hover:text-primary-blue-hover dark:hover:bg-primary-blue/10 dark:hover:text-primary-blue-hover flex items-center gap-2 rounded-full px-3 py-2 text-gray-500 transition-all duration-200 select-none dark:text-slate-400`}>
                                <MessageCircle className="group-hover:text-primary-blue-hover dark:group-hover:text-primary-blue-hover h-4 w-4 transition-colors" />
                                <span className="text-sm font-medium">{post._count.comments}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Komentar</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Share */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button onClick={handleCopy} className={`group hover:bg-secondary-green/10 hover:text-secondary-green-hover dark:hover:bg-secondary-green/10 dark:hover:text-secondary-green-hover flex items-center gap-2 rounded-full px-3 py-2 text-gray-500 transition-all duration-200 dark:text-slate-400`}>
                                <Forward className="group-hover:text-secondary-green-hover dark:group-hover:text-secondary-green-hover h-4 w-4 transition-colors" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Bagikan</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </>
    );
}
