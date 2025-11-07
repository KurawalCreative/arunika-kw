// components/PostCard.tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Heart, MoreVertical, Loader2, MessageCircle, Trash2, Forward } from "lucide-react";
import Image from "next/image";
import { Channel, Post, PostImage, User } from "@/generated/prisma/client";
import CommentsSection from "./comment-section";
import { Link } from "@/i18n/navigation";

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
    onCommentInputChange = () => { },
    onPostComment = () => { },
    onReplyTo = () => { },
    onReplyInputChange = () => { },
    onCreateReply = () => { },
    onDeleteComment = () => { },
    onDeleteReply = () => { },
    onOpenCommentMenuChange = () => { },
    onOpenReplyMenuChange = () => { },
}: PostCardProps) {
    return (<>
        <div className="rounded-lg bg-white p-2 transition-all hover:bg-gray-50 sm:p-4 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:shadow-none">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
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

            {/* Content */}
            <div
                dangerouslySetInnerHTML={{
                    __html: post.content,
                }}
                className="wrap-break-word prose dark:prose-invert prose-p:mb-2 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white mb-4 max-w-none text-gray-700 dark:text-slate-300"
            />

            {/* Images / Video */}
            {post.images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {post.images.map((image, idx) => {
                        const url = `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${image.url}`;
                        const ext = image.url.split(".").pop()?.toLowerCase() || "";
                        const isVideo = ["mp4", "webm", "ogg"].includes(ext);
                        return isVideo ? (
                            <video key={idx} src={url} controls className="h-40 w-full rounded-lg object-cover" />
                        ) : (
                            <button key={idx} onClick={() => onImageClick(url)} className="group relative h-40 w-full cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-75">
                                <Image src={url} alt="Post image" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center pb-4 justify-start gap-2 border-gray-200 dark:border-slate-700">
                <button onClick={onLike} disabled={loadingLike} className="flex items-center gap-1 rounded-full px-3 py-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400">
                    {loadingLike ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${post.isLikedByUser ? "fill-red-500 text-red-500" : ""}`} />}
                    <span className={`text-sm ${post.isLikedByUser ? "font-semibold text-red-500" : ""}`}>{post._count.likes}</span>
                </button>
                <Link href={`/komunitas/${channel?.name}/${post.id}`} className="flex items-center gap-1 rounded-full px-3 py-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post._count.comments}</span>
                </Link>
                <button onClick={onToggleComments} className="flex items-center gap-1 rounded-full px-3 py-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600 dark:text-slate-400 dark:hover:bg-green-500/10 dark:hover:text-green-400">
                    <Forward className="h-4 w-4" />
                </button>
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
        <div className="last:hidden max-w-3xl w-full mx-auto">
            <hr className="px-4 border-[1.5px] rounded-full" />
        </div>
    </>
    );
}
