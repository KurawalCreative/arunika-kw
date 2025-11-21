"use client";

import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChannelHeader from "@/components/channel-header";
import CreatePostDialog from "@/components/create-post-dialog";
import PostCard from "@/components/post-card";
import ImagePreviewDialog from "@/components/image-preview-dialog";
import { useChannelPage } from "@/hooks/useChannelPage";

export default function Page() {
    const data = useChannelPage();
    const { session, channel, loadingPage, posts, handleLoadMore, hasMorePosts, isLoadingMore, isOpen, setIsOpen, content, setContent, files, previews, isUploading, onFilesChange, removePreview, handleUpload, searchQuery, setSearchQuery, handleSearch, isSearching, selectedImage, setSelectedImage, imagePreviewOpen, setImagePreviewOpen } = data;

    if (loadingPage) {
        return (
            <div className="flex w-full items-center justify-center py-20 lg:pr-82">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <div className="flex w-full flex-1 flex-col p-6 lg:pr-82">
            <ChannelHeader authorImage={session?.user?.image || "/default-avatar.png"} authorName={session?.user?.name || "User"} channel={channel} searchQuery={searchQuery} isSearching={isSearching} onSearchChange={setSearchQuery} onSearch={handleSearch} onCreatePost={() => setIsOpen(true)} />
            <div className="space-y-6">
                <CreatePostDialog isOpen={isOpen} channel={channel} content={content} files={files} previews={previews} isUploading={isUploading} onOpenChange={setIsOpen} onContentChange={setContent} onFilesChange={onFilesChange} onRemovePreview={removePreview} onUpload={handleUpload} />

                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-20 text-gray-500 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                        <MessageCircle className="mb-4 h-12 w-12 opacity-50" />
                        <p className="text-lg text-gray-700 dark:text-slate-300">Belum ada postingan</p>
                        <p className="text-sm">Jadilah yang pertama berbagi</p>
                    </div>
                ) : (
                    <div className="w-full space-y-4">
                        {posts.map((post, index) => (
                            <PostCard
                                key={post.id}
                                channel={channel}
                                post={post}
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
                )}

                {hasMorePosts && (
                    <div className="flex justify-center">
                        <Button onClick={handleLoadMore} disabled={isLoadingMore} variant="outline" className="border-gray-200 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memuat...
                                </>
                            ) : (
                                "Muat Lebih Banyak"
                            )}
                        </Button>
                    </div>
                )}

                <ImagePreviewDialog isOpen={imagePreviewOpen} imageUrl={selectedImage} onOpenChange={setImagePreviewOpen} />
            </div>
        </div>
    );
}
