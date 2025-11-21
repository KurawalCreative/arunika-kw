// components/PostCard.tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Heart, MoreVertical, Loader2, MessageCircle, Trash2, Forward } from "lucide-react";
import Image from "next/image";
import { Channel, Post, PostImage, User } from "@/generated/prisma/client";
import CommentsSection from "./comment-section";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface PostCardProps {
    channel: Channel | null;
    post: Post & { author: User; images: PostImage[]; _count: { likes: number; comments: number }; isLikedByUser: boolean };
    currentUserId?: string;
    loadingLike: boolean;
    deletingPost: boolean;
    openMenu: boolean;
    onLike: () => void;
    onToggleComments: () => void;
    onDeletePost: () => void;
    onOpenMenuChange: (open: boolean) => void;
    onImageClick: (url: string) => void;

    // Comment props
    showComments?: boolean;
    comments?: any[];
    commentInput?: string;
    replyingTo?: string | null;
    replyInput?: Record<string, string>;
    loadingComment?: boolean;
    loadingReply?: string[];
    deletingComment?: string[];
    deletingReply?: string[];
    openCommentMenu?: string | null;
    openReplyMenu?: string | null;
    isLoadingComments?: boolean;
    onCommentInputChange?: (value: string) => void;
    onPostComment?: () => void;
    onReplyTo?: (commentId: string | null) => void;
    onReplyInputChange?: (commentId: string, value: string) => void;
    onCreateReply?: (commentId: string) => void;
    onDeleteComment?: (commentId: string) => void;
    onDeleteReply?: (replyId: string, commentId: string) => void;
    onOpenCommentMenuChange?: (id: string | null) => void;
    onOpenReplyMenuChange?: (id: string | null) => void;
}

export default function PostCard({
    channel,
    post,
    currentUserId,
    loadingLike,
    deletingPost,
    openMenu,
    onLike,
    onToggleComments,
    onDeletePost,
    onOpenMenuChange,
    onImageClick,

    // Comment Props
    showComments = false,
    comments = [],
    commentInput = "",
    replyingTo = null,
    replyInput = {},
    loadingComment = false,
    loadingReply = [],
    deletingComment = [],
    deletingReply = [],
    openCommentMenu = null,
    openReplyMenu = null,
    isLoadingComments = false,
    onCommentInputChange = () => {},
    onPostComment = () => {},
    onReplyTo = () => {},
    onReplyInputChange = () => {},
    onCreateReply = () => {},
    onDeleteComment = () => {},
    onDeleteReply = () => {},
    onOpenCommentMenuChange = () => {},
    onOpenReplyMenuChange = () => {},
}: PostCardProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [copy, setCopy] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const el = contentRef.current;
        if (el) {
            setIsOverflowing(el.scrollHeight > el.clientHeight + 10);
        }
    }, [post.content, showComments]);

    const handleCommentSectionToggle = () => {
        router.push(`/komunitas/${channel?.name}/${post.id}`);
    };

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

    return (
        <>
            <div className="group rounded-lg bg-white p-4 transition-all hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:shadow-none">
                <div onClick={handleCommentSectionToggle} className="cursor-pointer">
                    {/* Header */}
                    <div className="mb-4 flex w-full items-center justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            <Image width={40} height={40} src={post.author.image || ""} alt={post.author.name || ""} className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        {currentUserId === post.author.id && (
                            <DropdownMenu open={openMenu} onOpenChange={onOpenMenuChange}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white" disabled={deletingPost}>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={onDeletePost} className="text-red-600 transition-colors focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10" disabled={deletingPost}>
                                        {deletingPost ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Menghapus...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Images / Video */}
                    {post.images.length > 0 && (
                        <div
                            className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3"
                            onClick={(e) => e.stopPropagation()} // ⛔️ mencegah klik di gambar trigger router.push
                        >
                            {post.images.map((image, idx) => {
                                const url = `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${image.url}`;
                                const ext = image.url.split(".").pop()?.toLowerCase() || "";
                                const isVideo = ["mp4", "webm", "ogg"].includes(ext);
                                return isVideo ? (
                                    <video key={idx} src={url} controls className="h-40 w-full rounded-lg object-cover" />
                                ) : (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onImageClick(url); // preview
                                        }}
                                        className="group relative h-40 w-full cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-75"
                                    >
                                        <Image src={url} alt="Post image" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Post Content */}
                    <div className="relative my-4">
                        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: post.content }} className={`prose dark:prose-invert prose-p:mb-2 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white break-all text-gray-700 transition-all duration-300 dark:text-slate-300 ${showComments ? "max-h-none overflow-visible" : "max-h-144 overflow-hidden"}`} />

                        {!showComments && isOverflowing && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white via-white/80 to-transparent transition-colors duration-300 ease-in-out group-hover:from-gray-50 group-hover:via-gray-50/80 dark:from-[#0f172a] dark:via-[#0f172a]/80 dark:group-hover:from-slate-800/50 dark:group-hover:via-slate-800/70" />}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-start gap-3 pb-4">
                    {/* Like Button */}
                    <button
                        onClick={onLike}
                        disabled={loadingLike}
                        aria-label={post.isLikedByUser ? "Un-like post" : "Like post"}
                        className={`group flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${post.isLikedByUser ? "bg-accent-coral/10 text-accent-coral dark:bg-accent-coral/15" : "hover:bg-accent-coral/10 hover:text-accent-coral-hover dark:hover:bg-accent-coral/10 dark:hover:text-accent-coral-hover text-gray-500 dark:text-slate-400"} `}
                    >
                        {loadingLike ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 transition-colors ${post.isLikedByUser ? "fill-accent-coral text-accent-coral" : "group-hover:text-accent-coral-hover dark:group-hover:text-accent-coral-hover text-gray-500 dark:text-slate-400"}`} />}
                        <span className={`text-sm font-medium transition-colors ${post.isLikedByUser ? "text-accent-coral" : "text-gray-500 dark:text-slate-400"}`}>{post._count.likes}</span>
                    </button>

                    {/* Comment Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={`/komunitas/${channel?.name}/${post.id}`} aria-label={`${post._count.comments} komentar`} className={`group hover:bg-primary-blue/10 hover:text-primary-blue-hover dark:hover:bg-primary-blue/10 dark:hover:text-primary-blue-hover flex items-center gap-2 rounded-full px-3 py-2 text-gray-500 transition-all duration-200 dark:text-slate-400`}>
                                <MessageCircle className="group-hover:text-primary-blue-hover dark:group-hover:text-primary-blue-hover h-4 w-4 transition-colors" />
                                <span className="text-sm font-medium">{post._count.comments}</span>
                            </Link>
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

                {showComments && (
                    <CommentsSection
                        postId={post.id}
                        comments={comments}
                        commentInput={commentInput}
                        replyingTo={replyingTo}
                        replyInput={replyInput}
                        loadingComment={loadingComment}
                        loadingReply={loadingReply}
                        deletingComment={deletingComment}
                        deletingReply={deletingReply}
                        openMenu={openCommentMenu}
                        openReplyMenu={openReplyMenu}
                        currentUserId={currentUserId}
                        isLoading={isLoadingComments}
                        onCommentInputChange={onCommentInputChange}
                        onPostComment={onPostComment}
                        onReplyTo={onReplyTo}
                        onReplyInputChange={onReplyInputChange}
                        onCreateReply={onCreateReply}
                        onDeleteComment={onDeleteComment}
                        onDeleteReply={onDeleteReply}
                        onOpenMenuChange={onOpenCommentMenuChange}
                        onOpenReplyMenuChange={onOpenReplyMenuChange}
                    />
                )}
            </div>

            <div className="mx-auto w-full max-w-3xl last:hidden">
                <hr className="rounded-full border-[1.5px] px-4" />
            </div>
        </>
    );
}
