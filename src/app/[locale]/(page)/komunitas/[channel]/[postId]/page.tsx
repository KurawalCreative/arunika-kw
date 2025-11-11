"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useChannelPage } from "@/hooks/useChannelPage";

import CommentHeader from "@/components/comment-header";
import CommentList from "@/components/comment-list";
import { getPostWithComments, getComments, createComment, createReply, deleteComment, deleteReply } from "./actions";

type UserSummary = { id: string; name: string | null; image?: string | null };
type Reply = { id: string; content: string; createdAt: string; author: UserSummary };
type Comment = { id: string; content: string; createdAt: string; author: UserSummary; replies: Reply[] };
type Channel = { id: string; name: string | null; slug: string | null; region: string | null; description: string | null; logo: string | null };
type PostDetail = { id: string; content: string; channel: Channel; author: UserSummary; comments: Comment[]; images: { id: string; url: string }[]; _count: { likes: number; comments: number }; createdAt: string };

export default function Page() {
    const { postId } = useParams<{ postId: string }>();

    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const [commentInput, setCommentInput] = useState("");
    const [replyInput, setReplyInput] = useState<Record<string, string>>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const [loadingComment, setLoadingComment] = useState(false);
    const [loadingReply, setLoadingReply] = useState<string[]>([]);
    const [deletingComment, setDeletingComment] = useState<string[]>([]);
    const [deletingReply, setDeletingReply] = useState<string[]>([]);

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openReplyMenu, setOpenReplyMenu] = useState<string | null>(null);

    const { posts, session, handleLike, loadingLike } = useChannelPage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: any = await getPostWithComments(postId);
                setPost(data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [postId]);

    const fetchAndSetComments = async () => {
        if (!post) return;

        try {
            const updatedRaw = await getComments(post.id);

            const updatedComments: Comment[] = updatedRaw.map((c: any) => ({
                ...c,
                createdAt: new Date(c.createdAt).toISOString(),
                author: { ...c.author },
                replies: c.replies.map((r: any) => ({
                    ...r,
                    createdAt: new Date(r.createdAt).toISOString(),
                    author: { ...r.author },
                })),
            }));

            const totalComments = updatedComments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

            setPost((prev) =>
                prev
                    ? {
                          ...prev,
                          comments: updatedComments,
                          _count: { ...prev._count, comments: totalComments },
                      }
                    : prev,
            );
        } catch (err) {
            console.error("Failed to fetch comments:", err);
        }
    };

    const handlePostComment = async () => {
        const text = commentInput.trim();
        if (!text || !post || !session?.user) return;

        setLoadingComment(true);
        setCommentInput("");

        try {
            await createComment(post.id, text);
            await fetchAndSetComments();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingComment(false);
        }
    };

    const handleCreateReply = async (commentId: string) => {
        const text = replyInput[commentId]?.trim();
        if (!text || !post || !session?.user) return;

        setLoadingReply((prev) => [...prev, commentId]);
        setReplyInput((prev) => ({ ...prev, [commentId]: "" }));

        try {
            await createReply(commentId, text);
            await fetchAndSetComments(); // <-- panggil sini untuk update
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingReply((prev) => prev.filter((id) => id !== commentId));
            setReplyingTo(null);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!post) return;
        setDeletingComment((prev) => [...prev, commentId]);
        try {
            await deleteComment(commentId);
            setPost((prev) => (prev ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) } : prev));
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingComment((prev) => prev.filter((id) => id !== commentId));
        }
    };

    const handleDeleteReply = async (replyId: string, commentId: string) => {
        if (!post) return;
        setDeletingReply((prev) => [...prev, replyId]);
        try {
            await deleteReply(replyId);
            setPost((prev) =>
                prev
                    ? {
                          ...prev,
                          comments: prev.comments.map((c) => (c.id === commentId ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) } : c)),
                      }
                    : prev,
            );
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingReply((prev) => prev.filter((id) => id !== replyId));
        }
    };

    if (loading)
        return (
            <div className="flex min-h-screen w-full items-center justify-center lg:pr-82">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );

    if (!post) return <div className="flex justify-center py-20 text-gray-500">Post tidak ditemukan</div>;

    return (
        <div className="mx-auto space-y-8 px-4 py-8 lg:pr-82">
            <CommentHeader
                post={post}
                session={session}
                onlike={() =>
                    handleLike(
                        post.id,
                        posts.findIndex((p) => p.id === post.id),
                    )
                }
                onPostComment={handlePostComment}
                loadingLike={loadingLike.includes(post.id)}
                loadingComment={loadingComment}
                setCommentInput={setCommentInput}
                commentInput={commentInput}
            />
            <hr className="rounded-full border-[1.5px]" />
            <CommentList
                postId={post.id}
                comments={post.comments}
                commentInput={commentInput}
                replyingTo={replyingTo}
                replyInput={replyInput}
                loadingComment={loadingComment}
                loadingReply={loadingReply}
                deletingComment={deletingComment}
                deletingReply={deletingReply}
                openMenu={openMenu}
                openReplyMenu={openReplyMenu}
                isLoading={loading}
                onCommentInputChange={setCommentInput}
                onPostComment={handlePostComment}
                onReplyTo={setReplyingTo}
                onReplyInputChange={(id, v) => setReplyInput((prev) => ({ ...prev, [id]: v }))}
                onCreateReply={handleCreateReply}
                onDeleteComment={handleDeleteComment}
                onDeleteReply={handleDeleteReply}
                onOpenMenuChange={setOpenMenu}
                onOpenReplyMenuChange={setOpenReplyMenu}
            />
        </div>
    );
}
