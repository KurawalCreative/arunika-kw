"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2, Hash, ArrowRight, MessageSquare, Users, Zap } from "lucide-react";
import { getChannels } from "./actions";
import { Channel } from "@/generated/prisma/client";
import { Link } from "@/i18n/navigation";
import { useChannelPage } from "@/hooks/useChannelPage";
import KomunitasHeader from "@/components/komunitas-header";
import KomunitasPostCard from "@/components/komunitas-post-card";

export default function page() {
    const data = useChannelPage();
    const { session, channel, loadingPage, posts, handleLoadMore, hasMorePosts, isLoadingMore, isOpen, setIsOpen, content, setContent, files, previews, isUploading, onFilesChange, removePreview, handleUpload, searchQuery, setSearchQuery, handleSearch, isSearching, selectedImage, setSelectedImage, imagePreviewOpen, setImagePreviewOpen } = data;
    const router = useRouter();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getChannels().then((data) => {
            setChannels(data);
            setLoading(false);
        });
    }, []);

    if (loadingPage || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-600 dark:text-slate-400">Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-1 flex-col p-6 lg:pr-82">
            {/* Section Header */}
            <KomunitasHeader />

            <div className="w-full space-y-4">
                {posts.map((post, index) => (
                    <KomunitasPostCard
                        key={post.id}
                        channel={post.channel}
                        post={post}
                        showChannel={true}
                        currentUserId={session?.user?.email || undefined}
                        loadingLike={data.loadingLike.includes(post.id)}
                        deletingPost={data.deletingPost.includes(post.id)}
                        openMenu={data.openMenu === post.id}
                        onLike={() => data.handleLike(post.id, index)}
                        onToggleComments={() => data.handleToggleComments(post.id)}
                        onDeletePost={() => data.handleDeletePost(post.id)}
                        onOpenMenuChange={(open) => data.setOpenMenu(open ? post.id : null)}
                        onImageClick={(url) => {
                            data.setSelectedImage(url);
                            data.setImagePreviewOpen(true);
                        }}
                        showComments={data.expandedComments.includes(post.id)}
                        comments={data.comments[post.id] || []}
                        commentInput={data.commentInput[post.id] || ""}
                        replyingTo={data.replyingTo}
                        replyInput={data.replyInput}
                        loadingComment={data.loadingComment.includes(post.id)}
                        loadingReply={data.loadingReply}
                        deletingComment={data.deletingComment}
                        deletingReply={data.deletingReply}
                        openCommentMenu={data.openMenu}
                        openReplyMenu={data.openReplyMenu}
                        isLoadingComments={data.loadingComments.includes(post.id)}
                        onCommentInputChange={(value) => data.setCommentInput((prev) => ({ ...prev, [post.id]: value }))}
                        onPostComment={() => data.handlePostComment(post.id)}
                        onReplyTo={(commentId) => data.setReplyingTo(commentId)}
                        onReplyInputChange={(commentId, value) => data.setReplyInput((prev) => ({ ...prev, [commentId]: value }))}
                        onCreateReply={(commentId) => data.handleCreateReply(commentId, post.id)}
                        onDeleteComment={(commentId) => data.handleDeleteComment(commentId, post.id)}
                        onDeleteReply={(replyId, commentId) => data.handleDeleteReply(replyId, commentId, post.id)}
                        onOpenCommentMenuChange={(id) => data.setOpenMenu(id)}
                        onOpenReplyMenuChange={(id) => data.setOpenReplyMenu(id)}
                    />
                ))}
            </div>
        </div>
    );
}
