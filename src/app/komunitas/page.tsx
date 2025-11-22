"use client";

import { useChannelPage } from "@/hooks/useChannelPage";
import KomunitasHeader from "@/components/komunitas-header";
import KomunitasPostCard from "@/components/komunitas-post-card";

export default function page() {
    const data = useChannelPage();
    const { session, loadingPage, posts, loadingLike, deletingPost, openMenu, expandedComments, comments, commentInput, replyingTo, replyInput, loadingComment, loadingReply, deletingComment, deletingReply, openReplyMenu, loadingComments } = data;
    const loading = loadingPage;

    if (loading) {
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
        <div className="flex flex-1 flex-col p-6 lg:pr-82">
            <KomunitasHeader />

            <div className="w-full space-y-4">
                {posts.map((post, index) => (
                    <KomunitasPostCard
                        key={post.id}
                        channel={post.channel}
                        post={post}
                        showChannel={true}
                        currentUserId={session?.user?.email || undefined}
                        loadingLike={loadingLike.includes(post.id)}
                        deletingPost={deletingPost.includes(post.id)}
                        openMenu={openMenu === post.id}
                        onLike={async () => await data.handleLike(post.id, index)}
                        onToggleComments={() => data.handleToggleComments(post.id)}
                        onDeletePost={() => data.handleDeletePost(post.id)}
                        onOpenMenuChange={(open) => data.setOpenMenu(open ? post.id : null)}
                        onImageClick={(url) => {
                            data.setSelectedImage(url);
                            data.setImagePreviewOpen(true);
                        }}
                        showComments={expandedComments.includes(post.id)}
                        comments={comments[post.id] || []}
                        commentInput={commentInput[post.id] || ""}
                        replyingTo={replyingTo}
                        replyInput={replyInput}
                        loadingComment={loadingComment.includes(post.id)}
                        loadingReply={loadingReply}
                        deletingComment={deletingComment}
                        deletingReply={deletingReply}
                        openCommentMenu={openMenu}
                        openReplyMenu={openReplyMenu}
                        isLoadingComments={loadingComments.includes(post.id)}
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
