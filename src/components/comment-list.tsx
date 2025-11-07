// components/CommentList.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import CommentItem from "./comment-item";

interface CommentListProps {
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

export default function CommentList({
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
}: CommentListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-slate-700">
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