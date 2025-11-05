"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Channel, Post, PostImage, User } from "@/generated/prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getChannelBySlug, getPost, getPresignedUrl, storePost, toggleLike, getComments, createComment, deleteComment, createReply, deleteReply, deletePost, searchPosts, getUserLikedPosts } from "./actions";
import { Button } from "@/components/ui/button";
import { MinimalTiptap } from "@/components/ui/shadcn-io/minimal-tiptap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon, Heart, MoreVertical, Loader2, ChevronDown, ChevronUp, Search, Upload, Send, Trash2, MessageCircle } from "lucide-react";
import axios, { AxiosProgressEvent } from "axios";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function page() {
    const params = useParams<{ channel: string }>();
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

    useEffect(() => {
        setLoadingPage(true);
        Promise.all([
            getChannelBySlug(params.channel).then(setChannel), //
            getPost(params.channel).then((r) => setPosts(r || [])),
            // getUserLikedPosts(params.channel).then((ids) => setLikedPosts(new Set(ids))),
        ]).finally(() => setLoadingPage(false));
    }, [params.channel]);

    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const handleSearch = async () => {
        setIsSearching(true);
        if (!searchQuery.trim()) {
            const data = await getPost(params.channel);
            setPosts(data || []);
        } else {
            const data = await searchPosts(params.channel, searchQuery);
            setPosts(data || []);
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
            setComments((prev) => ({
                ...prev,
                [postId]: [newComment, ...(prev[postId] || [])],
            }));

            setPosts((prev) => {
                const copy = [...prev];
                const post = copy.find((p) => p.id === postId);
                if (post) post._count.comments += 1;
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
            setComments((prev) => ({
                ...prev,
                [postId]:
                    prev[postId]?.map((c) => {
                        if (c.id === commentId) {
                            return { ...c, replies: [...(c.replies || []), newReply] };
                        }
                        return c;
                    }) || [],
            }));
            setReplyingTo(null);
        }

        setLoadingReply((prev) => prev.filter((id) => id !== commentId));
    };

    const handleDeleteReply = async (replyId: string, commentId: string, postId: string) => {
        setDeletingReply((prev) => [...prev, replyId]);
        const success = await deleteReply(replyId);
        if (success) {
            setComments((prev) => ({
                ...prev,
                [postId]:
                    prev[postId]?.map((c) => {
                        if (c.id === commentId) {
                            return { ...c, replies: c.replies?.filter((r: any) => r.id !== replyId) || [] };
                        }
                        return c;
                    }) || [],
            }));

            setPosts((prev) => {
                const copy = [...prev];
                const post = copy.find((p) => p.id === postId);
                if (post) post._count.comments = Math.max(0, post._count.comments - 1);
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

        const comment = comments[postId]?.find((c) => c.id === commentId);
        const totalToDelete = 1 + (comment?.replies?.length || 0);

        const success = await deleteComment(commentId);
        if (success) {
            setComments((prev) => ({
                ...prev,
                [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
            }));

            setPosts((prev) => {
                const copy = [...prev];
                const post = copy.find((p) => p.id === postId);
                if (post) post._count.comments = Math.max(0, post._count.comments - totalToDelete);
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

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 backdrop-blur-sm transition-colors dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">#{channel?.name}</h1>
                        <p className="mt-1 text-gray-600 dark:text-slate-400">{channel?.description}</p>
                    </div>
                    <Button onClick={() => setIsOpen(true)} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 sm:w-auto">
                        <Upload className="h-4 w-4" />
                        Buat Post
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                        <Input placeholder="Cari postingan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} className="border-gray-200 bg-gray-50 pl-10 text-gray-900 placeholder-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500" />
                    </div>
                    <Button onClick={handleSearch} disabled={isSearching} variant="outline" className="border-gray-200 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        {isSearching ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mencari...
                            </>
                        ) : (
                            "Cari"
                        )}
                    </Button>
                </div>
            </div>

            {/* Upload Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="border-gray-200 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <div className="max-h-[60vh] space-y-4 overflow-auto">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-white">Buat postingan di #{channel?.name}</DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-slate-400">Bagikan pemikiran Anda dengan komunitas</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-gray-700 dark:text-slate-300">Konten</Label>
                                <MinimalTiptap onChange={setContent} placeholder="Tulis sesuatu..." className="mt-2 min-h-[150px]" />
                            </div>

                            <div>
                                <Label className="text-gray-700 dark:text-slate-300">Media</Label>
                                <Input type="file" accept="image/*,video/*" multiple onChange={onFilesChange} className="mt-2 border-gray-200 bg-gray-50 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                            </div>

                            {previews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {previews.map((url, idx) => (
                                        <div key={url} className="group relative">
                                            {files[idx]?.type.startsWith("video") ? <video src={url} className="h-24 w-full rounded-lg object-cover" /> : <img src={url} alt={`preview-${idx}`} className="h-24 w-full rounded-lg object-cover" />}
                                            <button onClick={() => removePreview(idx)} className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                <XIcon className="h-5 w-5 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleUpload} disabled={isUploading} className="w-full bg-blue-600 transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mengunggah...
                                </>
                            ) : (
                                "Posting"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Posts List */}
            {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-20 text-gray-500 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                    <MessageCircle className="mb-4 h-12 w-12 opacity-50" />
                    <p className="text-lg text-gray-700 dark:text-slate-300">Belum ada postingan</p>
                    <p className="text-sm">Jadilah yang pertama berbagi</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post, i) => (
                        <div key={post.id} className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:shadow-none">
                            {/* Header */}
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex min-w-0 items-center gap-3">
                                    <Image width={40} height={40} src={post.author.image || ""} alt={post.author.name || ""} className="h-10 w-10 shrink-0 rounded-full" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">{new Date(post.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                <DropdownMenu open={openMenu === post.id} onOpenChange={(open) => setOpenMenu(open ? post.id : null)}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white" disabled={deletingPost.includes(post.id)}>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-red-600 transition-colors focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10" disabled={deletingPost.includes(post.id)}>
                                            {deletingPost.includes(post.id) ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Menghapus...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Content */}
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                                className="prose dark:prose-invert prose-p:mb-2 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white mb-4 max-w-none text-gray-700 dark:text-slate-300"
                            />

                            {/* Images / Video */}
                            {post.images.length > 0 && (
                                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {post.images.map((image, idx) => {
                                        const url = `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${image.url}`;
                                        const ext = image.url.split(".").pop()?.toLowerCase() || "";
                                        const isVideo = ["mp4", "webm", "ogg"].includes(ext);
                                        return isVideo ? <video key={idx} src={url} controls className="h-40 w-full rounded-lg object-cover" /> : <Image key={idx} width={300} height={300} src={url} alt="" className="h-40 w-full rounded-lg object-cover" />;
                                    })}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mb-4 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4 dark:border-slate-700">
                                <button onClick={() => handleLike(post.id, i)} disabled={loadingLike.includes(post.id)} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400">
                                    {loadingLike.includes(post.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${post.isLikedByUser ? "fill-red-500 text-red-500" : ""}`} />}
                                    <span className={post.isLikedByUser ? "font-semibold text-red-500" : ""}>{post._count.likes}</span>
                                </button>

                                <button onClick={() => handleToggleComments(post.id)} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400">
                                    {expandedComments.includes(post.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    <span>{post._count.comments}</span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {expandedComments.includes(post.id) && (
                                <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-slate-700">
                                    {loadingComments.includes(post.id) ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                                        </div>
                                    ) : (
                                        <>
                                            {/* Add Comment Form */}
                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                <Input
                                                    placeholder="Tulis komentar..."
                                                    value={commentInput[post.id] || ""}
                                                    onChange={(e) =>
                                                        setCommentInput((prev) => ({
                                                            ...prev,
                                                            [post.id]: e.target.value,
                                                        }))
                                                    }
                                                    disabled={loadingComment.includes(post.id)}
                                                    className="border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                                                />
                                                <Button onClick={() => handlePostComment(post.id)} size="sm" disabled={loadingComment.includes(post.id)} className="bg-blue-600 hover:bg-blue-700">
                                                    {loadingComment.includes(post.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                </Button>
                                            </div>

                                            {/* Comments List */}
                                            <div className="space-y-3">
                                                {comments[post.id]?.map((comment) => (
                                                    <div key={comment.id} className="space-y-2 rounded-lg bg-gray-50 p-3 transition-colors dark:bg-slate-900/50">
                                                        {/* Parent Comment */}
                                                        <div className="flex gap-3">
                                                            <Avatar className="h-8 w-8 shrink-0">
                                                                <AvatarImage src={comment.author.image} />
                                                                <AvatarFallback className="bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-white">{comment.author.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.author.name}</p>
                                                                <p className="text-sm break-words text-gray-700 dark:text-slate-300">{comment.content}</p>
                                                                <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="mt-1 text-xs text-blue-600 transition-colors hover:underline dark:text-blue-400">
                                                                    Balas
                                                                </button>
                                                            </div>
                                                            <DropdownMenu open={openMenu === comment.id} onOpenChange={(open) => setOpenMenu(open ? comment.id : null)}>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white" disabled={deletingComment.includes(comment.id)}>
                                                                        <MoreVertical className="h-3 w-3" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleDeleteComment(comment.id, post.id)} className="text-red-600 transition-colors focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10" disabled={deletingComment.includes(comment.id)}>
                                                                        {deletingComment.includes(comment.id) ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                                                Menghapus...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Trash2 className="mr-2 h-3 w-3" />
                                                                                Hapus
                                                                            </>
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        {/* Reply Form */}
                                                        {replyingTo === comment.id && (
                                                            <div className="ml-6 flex flex-col gap-2 sm:ml-11 sm:flex-row">
                                                                <Input
                                                                    placeholder="Tulis balasan..."
                                                                    value={replyInput[comment.id] || ""}
                                                                    onChange={(e) =>
                                                                        setReplyInput((prev) => ({
                                                                            ...prev,
                                                                            [comment.id]: e.target.value,
                                                                        }))
                                                                    }
                                                                    disabled={loadingReply.includes(comment.id)}
                                                                    className="border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder-gray-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                                                                />
                                                                <Button onClick={() => handleCreateReply(comment.id, post.id)} size="sm" disabled={loadingReply.includes(comment.id)} className="bg-blue-600 hover:bg-blue-700">
                                                                    {loadingReply.includes(comment.id) ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {/* Replies List */}
                                                        {comment.replies?.map((reply: any) => (
                                                            <div key={reply.id} className="ml-6 flex gap-2 rounded-lg bg-gray-100 p-2 transition-colors sm:ml-11 dark:bg-slate-800/50">
                                                                <Avatar className="h-6 w-6 shrink-0">
                                                                    <AvatarImage src={reply.author.image} />
                                                                    <AvatarFallback className="bg-gray-200 text-xs text-gray-900 dark:bg-slate-700 dark:text-white">{reply.author.name[0]}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{reply.author.name}</p>
                                                                    <p className="text-xs break-words text-gray-700 dark:text-slate-300">{reply.content}</p>
                                                                </div>
                                                                <DropdownMenu open={openReplyMenu === reply.id} onOpenChange={(open) => setOpenReplyMenu(open ? reply.id : null)}>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white" disabled={deletingReply.includes(reply.id)}>
                                                                            <MoreVertical className="h-3 w-3" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => handleDeleteReply(reply.id, comment.id, post.id)} className="text-red-600 transition-colors focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10" disabled={deletingReply.includes(reply.id)}>
                                                                            {deletingReply.includes(reply.id) ? (
                                                                                <>
                                                                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                                                    Menghapus...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Trash2 className="mr-2 h-3 w-3" />
                                                                                    Hapus
                                                                                </>
                                                                            )}
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
