"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";

interface Comment {
    id: string;
    content: string;
    authorId: string;
    postId?: string;
    parentId?: string;
    targetUserId?: string;
    author: {
        id: string;
        name: string;
        image: string;
    };
    replies?: Comment[];
    createdAt: string;
    updatedAt: string;
}

interface Post {
    id: string;
    comments?: Comment[];
    commentCount?: number;
}

interface CommentsDialogProps {
    selectedPost: Post | null;
    onClose: () => void;
    onCommentSubmit: (comment: Comment) => void;
    onCommentDelete: (comment: Comment) => void;
    session: any;
}

const CommentItem = ({ comment, depth = 0, onReply, onDelete, session }: { comment: Comment; depth?: number; onReply: (comment: Comment) => void; onDelete: (comment: Comment) => void; session: any }) => {
    const maxDepth = 1;

    return (
        <div className={`${depth > 0 ? "ml-8 border-l-2 border-gray-200 pl-4 dark:border-gray-600" : ""}`}>
            <div className="flex items-start gap-3 border-b pb-3 dark:border-gray-700">
                <Link href={`/komunitas/profile/${comment.author.id}`} className="transition-opacity hover:opacity-80">
                    <Avatar className="size-8">
                        <AvatarImage src={comment.author.image} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link href={`/komunitas/profile/${comment.author.id}`} className="hover:underline">
                                <span className="text-font-primary dark:text-background text-sm font-semibold">{comment.author.name}</span>
                            </Link>
                            <span className="text-font-secondary text-xs dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {(comment.author.id === session?.user.id || (session?.user as any)?.role === "admin") && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {depth < maxDepth && <DropdownMenuItem onClick={() => onReply(comment)}>Reply</DropdownMenuItem>}
                                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => onDelete(comment)}>
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                    <p className="text-font-primary mt-1 text-sm dark:text-gray-300">{comment.content}</p>
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} onDelete={onDelete} session={session} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CommentsDialog({ selectedPost, onClose, onCommentSubmit, onCommentDelete, session }: CommentsDialogProps) {
    const [commentInputValue, setCommentInputValue] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [replyTargetUser, setReplyTargetUser] = useState<{ id: string; name: string } | null>(null);
    const [replyParentId, setReplyParentId] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // Load comments when dialog opens
    useEffect(() => {
        if (selectedPost && !selectedPost.comments) {
            loadComments();
        } else if (selectedPost?.comments) {
            setComments(selectedPost.comments);
        } else {
            setComments([]);
        }
    }, [selectedPost]);

    const loadComments = async () => {
        if (!selectedPost) return;

        setLoadingComments(true);
        try {
            const response = await axios.get(`/api/komunitas/komentar?postId=${selectedPost.id}`);
            setComments(response.data.comments || []);
        } catch (error) {
            console.error("Failed to load comments:", error);
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCommentDelete = async (comment: Comment) => {
        try {
            await axios.delete(`/api/komunitas/komentar?id=${encodeURIComponent(comment.id)}`);

            // Update local comments state
            if (comment.parentId) {
                // remove from parent's replies
                setComments((prev) => prev.map((c) => (c.id === comment.parentId ? { ...c, replies: (c.replies || []).filter((r) => r.id !== comment.id) } : c)));
            } else {
                // remove from top-level comments
                setComments((prev) => prev.filter((c) => c.id !== comment.id));
            }

            onCommentDelete(comment);
        } catch (err) {
            console.error("Gagal hapus komentar", err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPost || !commentInputValue.trim()) return;
        setPostingComment(true);
        try {
            const res = await axios.post("/api/komunitas/komentar", {
                postId: selectedPost.id,
                content: commentInputValue.trim(),
                targetUserId: replyTargetUser?.id ?? null,
                parentId: replyParentId,
            });
            if (res.data?.success) {
                const comment = res.data.comment as Comment;
                // Update local comments state
                if (comment.parentId) {
                    // it's a reply, add to parent's replies
                    setComments((prev) => prev.map((c) => (c.id === comment.parentId ? { ...c, replies: [...(c.replies || []), comment] } : c)));
                } else {
                    // it's a top-level comment
                    setComments((prev) => [comment, ...prev]);
                }
                onCommentSubmit(comment);
                setCommentInputValue("");
                setReplyTargetUser(null);
                setReplyParentId(null);
            }
        } catch (err) {
            console.error("Gagal kirim komentar", err);
        } finally {
            setPostingComment(false);
        }
    };

    return (
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="flex h-[80vh] w-full max-w-4xl flex-col dark:border-gray-700 dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle>Komentar</DialogTitle>
                    <DialogDescription>Lihat dan tambahkan komentar untuk postingan ini</DialogDescription>
                </DialogHeader>
                <div className="flex flex-1 flex-col gap-4 overflow-hidden">
                    <div className="shrink-0 border-b p-4">
                        <Textarea value={commentInputValue} onChange={(e) => setCommentInputValue(e.target.value)} placeholder="Tulis komentar di sini..." className="dark:border-gray-700 dark:bg-gray-800" />
                        <div className="mt-2 flex gap-2">
                            <Button className="flex-1" onClick={handleSubmit} disabled={postingComment}>
                                {postingComment ? "Mengirim..." : "Kirim Komentar"}
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                Tutup
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4">
                        <h3 className="text-font-primary dark:text-background mb-4 text-lg font-semibold">Komentar</h3>
                        {loadingComments ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                                <span className="ml-2 text-gray-500">Memuat komentar...</span>
                            </div>
                        ) : !selectedPost ? (
                            <p className="text-font-secondary text-sm dark:text-gray-400">Pilih postingan untuk melihat komentar.</p>
                        ) : comments.length === 0 ? (
                            <p className="text-font-secondary text-sm dark:text-gray-400">Belum ada komentar. Jadilah yang pertama!</p>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((c) => (
                                    <CommentItem
                                        key={c.id}
                                        comment={c}
                                        onReply={(comment) => {
                                            setReplyTargetUser({ id: comment.author.id, name: comment.author.name });
                                            setReplyParentId(comment.id);
                                            setCommentInputValue(`@${comment.author.name} `);
                                        }}
                                        onDelete={handleCommentDelete}
                                        session={session}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
