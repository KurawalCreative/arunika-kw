"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import CommentHeader from "@/components/comment-header";
import CommentList from "@/components/comment-list";
import { getPostWithComments } from "./actions";

export default function Page() {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPostWithComments(postId);
                setPost(data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [postId]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center py-20 text-gray-500">
                Post tidak ditemukan
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <CommentHeader />
            <CommentList
                postId={post.id}
                comments={post.comments}
                commentInput=""
                replyingTo={null}
                replyInput={{}}
                loadingComment={false}
                loadingReply={[]}
                deletingComment={[]}
                deletingReply={[]}
                openMenu={null}
                openReplyMenu={null}
                currentUserId={undefined}
                isLoading={false}
                onCommentInputChange={() => { }}
                onPostComment={() => { }}
                onReplyTo={() => { }}
                onReplyInputChange={() => { }}
                onCreateReply={() => { }}
                onDeleteComment={() => { }}
                onDeleteReply={() => { }}
                onOpenMenuChange={() => { }}
                onOpenReplyMenuChange={() => { }}
            />
        </div>
    );
}
