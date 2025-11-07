// page.tsx (Main Page - Refactored)
"use client";

import { Channel, Post, PostImage, User } from "@/generated/prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getChannelBySlug, getPost, getPresignedUrl, storePost, toggleLike, getComments, createComment, deleteComment, createReply, deleteReply, deletePost, searchPosts } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import axios, { AxiosProgressEvent } from "axios";
import ChannelHeader from "@/components/channel-header";
import CreatePostDialog from "@/components/create-post-dialog";
import PostCard from "@/components/post-card";
import ImagePreviewDialog from "@/components/image-preview-dialog";

export default function page() {
    const params = useParams<{ channel: string }>();
    const { data: session } = useSession();
    const [channel, setChannel] = useState<Channel | null>(null);
    const [loadingPage, setLoadingPage] = useState(true);

    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [posts, setPosts] = useState<(Post & { author: User; images: PostImage[]; _count: { likes: number; comments: number }; isLikedByUser: boolean })[]>([]);
    const [expandedComments, setExpandedComments] = useState<string[]>([]);
    const [comments, setComments] = useState<Record<string, any[]>>({});
    const [commentInput, setCommentInput] = useState<Record<string, string>>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyInput, setReplyInput] = useState<Record<string, string>>({});
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openReplyMenu, setOpenReplyMenu] = useState<string | null>(null);
    const [loadingLike, setLoadingLike] = useState<string[]>([]);
    const [loadingComment, setLoadingComment] = useState<string[]>([]);
    const [loadingReply, setLoadingReply] = useState<string[]>([]);
    const [deletingPost, setDeletingPost] = useState<string[]>([]);
    const [deletingComment, setDeletingComment] = useState<string[]>([]);
    const [deletingReply, setDeletingReply] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingComments, setLoadingComments] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const POSTS_PER_PAGE = 10;

    useEffect(() => {
        setLoadingPage(true);
        setCurrentPage(1);
        setPosts([]);
        Promise.all([
            getChannelBySlug(params.channel).then(setChannel),
            getPost(params.channel, 1, POSTS_PER_PAGE).then((r) => {
                setPosts(r.posts || []);
                setTotalPosts(r.total || 0);
            }),
        ]).finally(() => setLoadingPage(false));
    }, [params.channel]);

    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const handleSearch = async () => {
        setIsSearching(true);
        setCurrentPage(1);
        setPosts([]);
        if (!searchQuery.trim()) {
            const data = await getPost(params.channel, 1, POSTS_PER_PAGE);
            setPosts(data.posts || []);
            setTotalPosts(data.total || 0);
        } else {
            const data = await searchPosts(params.channel, searchQuery, 1, POSTS_PER_PAGE);
            setPosts(data.posts || []);
            setTotalPosts(data.total || 0);
        }
        setIsSearching(false);
    };

    const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
        setFiles((prev) => [...prev, ...newFiles]);
        setPreviews((prev) => [...prev, ...newPreviews]);
        setUploadProgress((prev) => [...prev, ...newFiles.map(() => 0)]);
        e.currentTarget.value = "";
    };

    const removePreview = (index: number) => {
        const url = previews[index];
        if (url) URL.revokeObjectURL(url);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setUploadProgress((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        setIsUploading(true);
        var images = [];

        let i = -1;
        for await (let file of files) {
            i++;
            try {
                const uri = await getPresignedUrl(file.name, file.type);

                await axios.put(uri.url, file, {
                    headers: {
                        "Content-Type": file.type,
                    },
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        const loaded = progressEvent.loaded;
                        const total = progressEvent.total ?? file.size;
                        const percent = Math.min(100, Math.round((loaded / total) * 100));
                        setUploadProgress((prev) => {
                            const copy = [...prev];
                            copy[i] = percent;
                            return copy;
                        });
                    },
                });

                setUploadProgress((prev) => {
                    const copy = [...prev];
                    copy[i] = 100;
                    return copy;
                });

                images.push(uri.key);
            } catch (err) {
                console.error("Upload gagal", err);
                setUploadProgress((prev) => {
                    const copy = [...prev];
                    copy[i] = 0;
                    return copy;
                });
            }
        }

        await storePost(content, images, params.channel);

        setCurrentPage(1);
        const data = await getPost(params.channel, 1, POSTS_PER_PAGE);
        setPosts(data.posts || []);
        setTotalPosts(data.total || 0);

        setIsUploading(false);
        setIsOpen(false);
        setContent("");
        setFiles([]);
        setPreviews([]);
        setUploadProgress([]);
    };

    const handleToggleComments = async (postId: string) => {
        if (expandedComments.includes(postId)) {
            setExpandedComments((prev) => prev.filter((id) => id !== postId));
        } else {
            setExpandedComments((prev) => [...prev, postId]);
            if (!comments[postId]) {
                setLoadingComments((prev) => [...prev, postId]);
                const data = await getComments(postId);
                setComments((prev) => ({ ...prev, [postId]: data }));
                setLoadingComments((prev) => prev.filter((id) => id !== postId));
            }
        }
    };

    const handlePostComment = async (postId: string) => {
        const text = commentInput[postId]?.trim();
        if (!text) return;

        setLoadingComment((prev) => [...prev, postId]);
        setCommentInput((prev) => ({ ...prev, [postId]: "" }));

        const newComment = await createComment(postId, text);
        if (newComment) {
            // Fetch fresh data from database
            const updatedComments = await getComments(postId);
            setComments((prev) => ({ ...prev, [postId]: updatedComments }));

            // Calculate total count (comments + all replies)
            const totalCount = updatedComments.reduce((sum, comment) => {
                return sum + 1 + (comment.replies?.length || 0);
            }, 0);

            // Update count based on fresh data
            setPosts((prev) => {
                const copy = [...prev];
                const post = copy.find((p) => p.id === postId);
                if (post) post._count.comments = totalCount;
                return copy;
            });
        }

        setLoadingComment((prev) => prev.filter((id) => id !== postId));
    };

    const handleCreateReply = async (commentId: string, postId: string) => {
        const text = replyInput[commentId]?.trim();
        if (!text) return;

        setLoadingReply((prev) => [...prev, commentId]);
        setReplyInput((prev) => ({ ...prev, [commentId]: "" }));

        const newReply = await createReply(commentId, text);
        if (newReply) {
            // Fetch fresh data from database
            const updatedComments = await getComments(postId);
            setComments((prev) => ({ ...prev, [postId]: updatedComments }));

            // Calculate total count (comments + all replies)
            const totalCount = updatedComments.reduce((sum, comment) => {
                return sum + 1 + (comment.replies?.length || 0);
            }, 0);

            // Update count based on fresh data
            setPosts((prev) => {
                const copy = [...prev];
                const post = copy.find((p) => p.id === postId);
                if (post) post._count.comments = totalCount;
                return copy;
            });

            setReplyingTo(null);
        }

        setLoadingReply((prev) => prev.filter((id) => id !== commentId));
    };

    const handleDeleteReply = async (replyId: string, commentId: string, postId: string) => {
        setDeletingReply((prev) => [...prev, replyId]);
        const success = await deleteReply(replyId);
        if (success) {
            // Fetch fresh data from database
            const updatedComments = await getComments(postId);
            setComments((prev) => ({ ...prev, [postId]: updatedComments }));

            // Calculate total count (comments + all replies)
            const totalCount = updatedComments.reduce((sum, comment) => {
                return sum + 1 + (comment.replies?.length || 0);
            }, 0);

            // Update count based on fresh data
            setPosts((prev) => {
                const copy = [...prev];
                const post = copy.find((p) => p.id === postId);
                if (post) post._count.comments = totalCount;
                return copy;
            });
        }
        setDeletingReply((prev) => prev.filter((id) => id !== replyId));
    };

    const handleDeletePost = async (postId: string) => {
        setDeletingPost((prev) => [...prev, postId]);
        const success = await deletePost(postId);
        if (success) {
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            setOpenMenu(null);
        }
        setDeletingPost((prev) => prev.filter((id) => id !== postId));
    };

    const handleDeleteComment = async (commentId: string, postId: string) => {
        setDeletingComment((prev) => [...prev, commentId]);

        const success = await deleteComment(commentId);
        if (success) {
            // Fetch fresh data from database
            const updatedComments = await getComments(postId);
            setComments((prev) => ({ ...prev, [postId]: updatedComments }));

            // Update count based on fresh data
            setPosts((prev) => {
                const copy = [...prev];
                const post = copy.find((p) => p.id === postId);
                if (post) post._count.comments = updatedComments.length;
                return copy;
            });
        }

        setDeletingComment((prev) => prev.filter((id) => id !== commentId));
    };

    const handleLike = async (postId: string, idx: number) => {
        setLoadingLike((prev) => [...prev, postId]);
        try {
            const result = await toggleLike(postId);
            setPosts((prev) => {
                const copy = [...prev];
                copy[idx]._count.likes = result!;
                copy[idx].isLikedByUser = !copy[idx].isLikedByUser;
                return copy;
            });
        } catch (err) {
            console.error("Failed toggle like", err);
        } finally {
            setLoadingLike((prev) => prev.filter((id) => id !== postId));
        }
    };

    if (loadingPage) {
        return (
            <div className="flex w-full items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        const data = await getPost(params.channel, nextPage, POSTS_PER_PAGE);
        setPosts((prev) => [...prev, ...data.posts]);
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
    };

    const hasMorePosts = posts.length < totalPosts;

    return (
        <div className="max-w-4xl w-full space-y-6 p-8">
            <ChannelHeader channel={channel} searchQuery={searchQuery} isSearching={isSearching} onSearchChange={setSearchQuery} onSearch={handleSearch} onCreatePost={() => setIsOpen(true)} />

            <CreatePostDialog isOpen={isOpen} channel={channel} content={content} files={files} previews={previews} isUploading={isUploading} onOpenChange={setIsOpen} onContentChange={setContent} onFilesChange={onFilesChange} onRemovePreview={removePreview} onUpload={handleUpload} />

            {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-20 text-gray-500 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                    <MessageCircle className="mb-4 h-12 w-12 opacity-50" />
                    <p className="text-lg text-gray-700 dark:text-slate-300">Belum ada postingan</p>
                    <p className="text-sm">Jadilah yang pertama berbagi</p>
                </div>
            ) : (
                <div className="space-y-4 w-full">
                    {posts.map((post, i) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUserId={(session?.user as any)?.id}
                            loadingLike={loadingLike.includes(post.id)}
                            deletingPost={deletingPost.includes(post.id)}
                            openMenu={openMenu === post.id}
                            onLike={() => handleLike(post.id, i)}
                            onToggleComments={() => handleToggleComments(post.id)}
                            onDeletePost={() => handleDeletePost(post.id)}
                            onOpenMenuChange={(open) => setOpenMenu(open ? post.id : null)}
                            onImageClick={(url) => {
                                setSelectedImage(url);
                                setImagePreviewOpen(true);
                            }}
                            // Comments props
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
                            onCommentInputChange={(value) => setCommentInput((prev) => ({ ...prev, [post.id]: value }))}
                            onPostComment={() => handlePostComment(post.id)}
                            onReplyTo={setReplyingTo}
                            onReplyInputChange={(commentId, value) => setReplyInput((prev) => ({ ...prev, [commentId]: value }))}
                            onCreateReply={(commentId) => handleCreateReply(commentId, post.id)}
                            onDeleteComment={(commentId) => handleDeleteComment(commentId, post.id)}
                            onDeleteReply={(replyId, commentId) => handleDeleteReply(replyId, commentId, post.id)}
                            onOpenCommentMenuChange={setOpenMenu}
                            onOpenReplyMenuChange={setOpenReplyMenu}
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
    );
}