"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosProgressEvent } from "axios";
import { getChannelBySlug, getPost, getPresignedUrl, storePost, toggleLike, deletePost, searchPosts } from "@/app/[locale]/(page)/komunitas/[channel]/actions";
import { getComments, createComment, createReply, deleteComment, deleteReply } from "@/app/[locale]/(page)/komunitas/[channel]/[postId]/actions";
import { Channel, Post, PostImage, User } from "@/generated/prisma/client";

export function useChannelPage() {
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
    const [posts, setPosts] = useState<
        (Post & {
            author: User;
            images: PostImage[];
            _count: { likes: number; comments: number };
            isLikedByUser: boolean;
            channel: Channel;
        })[]
    >([]);
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
            const updatedComments = await getComments(postId);
            setComments((prev) => ({ ...prev, [postId]: updatedComments }));

            const totalCount = updatedComments.reduce((sum, comment) => {
                return sum + 1 + (comment.replies?.length || 0);
            }, 0);

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
            const updatedComments = await getComments(postId);
            setComments((prev) => ({ ...prev, [postId]: updatedComments }));

            const totalCount = updatedComments.reduce((sum, comment) => {
                return sum + 1 + (comment.replies?.length || 0);
            }, 0);

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
            const updatedComments = await getComments(postId);
            setComments((prev) => ({ ...prev, [postId]: updatedComments }));

            const totalCount = updatedComments.reduce((sum, comment) => {
                return sum + 1 + (comment.replies?.length || 0);
            }, 0);

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
            const updatedComments = await getComments(postId);
            setComments((prev) => ({ ...prev, [postId]: updatedComments }));

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

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        const data = await getPost(params.channel, nextPage, POSTS_PER_PAGE);
        setPosts((prev) => [...prev, ...data.posts]);
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
    };

    const hasMorePosts = posts.length < totalPosts;

    return {
        session,
        channel,
        loadingPage,
        content,
        setContent,
        files,
        setFiles,
        previews,
        setPreviews,
        uploadProgress,
        isOpen,
        setIsOpen,
        isUploading,
        posts,
        expandedComments,
        comments,
        commentInput,
        setCommentInput,
        replyingTo,
        setReplyingTo,
        replyInput,
        setReplyInput,
        openMenu,
        setOpenMenu,
        openReplyMenu,
        setOpenReplyMenu,
        loadingLike,
        loadingComment,
        loadingReply,
        deletingPost,
        deletingComment,
        deletingReply,
        searchQuery,
        setSearchQuery,
        loadingComments,
        isSearching,
        selectedImage,
        setSelectedImage,
        imagePreviewOpen,
        setImagePreviewOpen,
        currentPage,
        totalPosts,
        isLoadingMore,
        POSTS_PER_PAGE,
        handleSearch,
        onFilesChange,
        removePreview,
        handleUpload,
        handleToggleComments,
        handlePostComment,
        handleCreateReply,
        handleDeleteReply,
        handleDeletePost,
        handleDeleteComment,
        handleLike,
        handleLoadMore,
        hasMorePosts,
    };
}
