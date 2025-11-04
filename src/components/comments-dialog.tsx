"use client";

import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
    comments: Comment[];
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
                <Avatar className="size-8">
                    <AvatarImage src={comment.author.image} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-font-primary dark:text-background text-sm font-semibold">{comment.author.name}</span>
                            <span className="text-font-secondary text-xs dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {depth < maxDepth && (
                                <button className="text-xs text-sky-600 hover:underline dark:text-sky-400" onClick={() => onReply(comment)}>
                                    Reply
                                </button>
                            )}
                            {(comment.author.id === session?.user.id || (session?.user as any).role === "admin") && (
                                <button className="text-xs text-red-600 hover:underline dark:text-red-400" onClick={() => onDelete(comment)}>
                                    Hapus
                                </button>
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
                        {!selectedPost ? (
                            <p className="text-font-secondary text-sm dark:text-gray-400">Pilih postingan untuk melihat komentar.</p>
                        ) : selectedPost.comments.length === 0 ? (
                            <p className="text-font-secondary text-sm dark:text-gray-400">Belum ada komentar. Jadilah yang pertama!</p>
                        ) : (
                            <div className="space-y-4">
                                {selectedPost.comments.map((c) => (
                                    <CommentItem
                                        key={c.id}
                                        comment={c}
                                        onReply={(comment) => {
                                            setReplyTargetUser({ id: comment.author.id, name: comment.author.name });
                                            setReplyParentId(comment.id);
                                            setCommentInputValue(`@${comment.author.name} `);
                                        }}
                                        onDelete={onCommentDelete}
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
