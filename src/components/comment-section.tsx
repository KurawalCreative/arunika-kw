// components/CommentsSection.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import CommentItem from "./comment-item";

interface CommentsSectionProps {
    postId: string;
    comments: any[];
    commentInput: string;
    replyingTo: string | null;
    replyInput: Record<string, string>;
    loadingComment: boolean;
    loadingReply: string[];
    deletingComment: string[];
    deletingReply: string[];
    openMenu: string | null;
    openReplyMenu: string | null;
    currentUserId?: string;
    isLoading: boolean;
    onCommentInputChange: (value: string) => void;
    onPostComment: () => void;
    onReplyTo: (commentId: string | null) => void;
    onReplyInputChange: (commentId: string, value: string) => void;
    onCreateReply: (commentId: string) => void;
    onDeleteComment: (commentId: string) => void;
    onDeleteReply: (replyId: string, commentId: string) => void;
    onOpenMenuChange: (id: string | null) => void;
    onOpenReplyMenuChange: (id: string | null) => void;
}

export default function CommentsSection({
    postId,
    comments,
    commentInput,
    replyingTo,
    replyInput,
    loadingComment,
    loadingReply,
    deletingComment,
    deletingReply,
    openMenu,
    openReplyMenu,
    currentUserId,
    isLoading,
    onCommentInputChange,
    onPostComment,
    onReplyTo,
    onReplyInputChange,
    onCreateReply,
    onDeleteComment,
    onDeleteReply,
    onOpenMenuChange,
    onOpenReplyMenuChange,
}: CommentsSectionProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-slate-700">
            {/* Add Comment Form */}
            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    placeholder="Tulis komentar..."
                    value={commentInput}
                    onChange={(e) => onCommentInputChange(e.target.value)}
                    disabled={loadingComment}
                    className="border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                />
                <Button onClick={onPostComment} size="sm" disabled={loadingComment} className="bg-blue-600 hover:bg-blue-700">
                    {loadingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
                {comments?.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        postId={postId}
                        replyingTo={replyingTo}
                        replyInput={replyInput[comment.id] || ""}
                        loadingReply={loadingReply.includes(comment.id)}
                        deletingComment={deletingComment.includes(comment.id)}
                        deletingReply={deletingReply}
                        openMenu={openMenu}
                        openReplyMenu={openReplyMenu}
                        currentUserId={currentUserId}
                        onReplyTo={onReplyTo}
                        onReplyInputChange={(value) => onReplyInputChange(comment.id, value)}
                        onCreateReply={() => onCreateReply(comment.id)}
                        onDeleteComment={() => onDeleteComment(comment.id)}
                        onDeleteReply={onDeleteReply}
                        onOpenMenuChange={onOpenMenuChange}
                        onOpenReplyMenuChange={onOpenReplyMenuChange}
                    />
                ))}
            </div>
        </div>
    );
}