"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Channel, Post, PostImage, User } from "@/generated/prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getChannelBySlug, getPost, getPresignedUrl, storePost, toggleLike, getComments, createComment, deleteComment, createReply, deleteReply, deletePost, searchPosts, getUserLikedPosts } from "./actions";
import { Button } from "@/components/ui/button";
import { MinimalTiptap } from "@/components/ui/shadcn-io/minimal-tiptap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon, Heart, MoreVertical, Loader2, ChevronDown, ChevronUp, Search, Upload, Send } from "lucide-react";
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
    const [posts, setPosts] = useState<(Post & { author: User; images: PostImage[]; _count: { likes: number; comments: number } })[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [comments, setComments] = useState<Record<string, any[]>>({});
    const [commentInput, setCommentInput] = useState<Record<string, string>>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyInput, setReplyInput] = useState<Record<string, string>>({});
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [loadingLike, setLoadingLike] = useState<Set<string>>(new Set());
    const [loadingComment, setLoadingComment] = useState<Set<string>>(new Set());
    const [loadingReply, setLoadingReply] = useState<Set<string>>(new Set());
    const [deletingPost, setDeletingPost] = useState<Set<string>>(new Set());
    const [deletingComment, setDeletingComment] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setLoadingPage(true);
        Promise.all([
            getChannelBySlug(params.channel).then(setChannel), //
            getPost(params.channel).then(setPosts),
            getUserLikedPosts(params.channel).then((ids) => setLikedPosts(new Set(ids))),
        ]).finally(() => setLoadingPage(false));
    }, [params.channel]);

    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            const data = await getPost(params.channel);
            setPosts(data);
        } else {
            const data = await searchPosts(params.channel, searchQuery);
            setPosts(data);
        }
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
        setIsOpen(false);
    };

    const handleToggleComments = async (postId: string) => {
        const newExpanded = new Set(expandedComments);
        if (newExpanded.has(postId)) {
            newExpanded.delete(postId);
        } else {
            newExpanded.add(postId);
            if (!comments[postId]) {
                const data = await getComments(postId);
                setComments((prev) => ({ ...prev, [postId]: data }));
            }
        }
        setExpandedComments(newExpanded);
    };

    const handlePostComment = async (postId: string) => {
        const text = commentInput[postId]?.trim();
        if (!text) return;

        setLoadingComment((prev) => new Set(prev).add(postId));
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

        setLoadingComment((prev) => {
            const next = new Set(prev);
            next.delete(postId);
            return next;
        });
    };

    const handleCreateReply = async (commentId: string, postId: string) => {
        const text = replyInput[commentId]?.trim();
        if (!text) return;

        setLoadingReply((prev) => new Set(prev).add(commentId));
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

        setLoadingReply((prev) => {
            const next = new Set(prev);
            next.delete(commentId);
            return next;
        });
    };

    const handleDeleteReply = async (replyId: string, commentId: string, postId: string) => {
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
        }
    };

    const handleDeletePost = async (postId: string) => {
        setDeletingPost((prev) => new Set(prev).add(postId));
        const success = await deletePost(postId);
        if (success) {
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            setOpenMenu(null);
        }
        setDeletingPost((prev) => {
            const next = new Set(prev);
            next.delete(postId);
            return next;
        });
    };

    const handleDeleteComment = async (commentId: string, postId: string) => {
        setDeletingComment((prev) => new Set(prev).add(commentId));

        // hitung total yang akan dihapus (parent + replies)
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

        setDeletingComment((prev) => {
            const next = new Set(prev);
            next.delete(commentId);
            return next;
        });
    };

    const handleLike = async (postId: string, idx: number) => {
        setLoadingLike((prev) => new Set(prev).add(postId));
        try {
            const newCount = await toggleLike(postId);
            if (newCount !== null) {
                setPosts((prev) => {
                    const copy = [...prev];
                    copy[idx]._count.likes = newCount;
                    return copy;
                });

                const newLiked = new Set(likedPosts);
                newLiked.has(postId) ? newLiked.delete(postId) : newLiked.add(postId);
                setLikedPosts(newLiked);
            }
        } catch (err) {
            console.error("Failed toggle like", err);
        } finally {
            setLoadingLike((prev) => {
                const next = new Set(prev);
                next.delete(postId);
                return next;
            });
        }
    };

    if (loadingPage) {
        return (
            <div className="flex w-full items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex w-full flex-1 flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b bg-white">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{channel?.name}</h1>
                        <p className="text-sm text-gray-500">{channel?.description}</p>
                    </div>
                    <Button onClick={() => setIsOpen(true)} size="sm" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Buat Post
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="border-t bg-gray-50 px-6 py-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Cari postingan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} className="pl-10" />
                        </div>
                        <Button onClick={handleSearch} size="sm">
                            Cari
                        </Button>
                    </div>
                </div>
            </div>

            {/* Upload Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[80vh] p-6">
                    {/* scrollable area */}
                    <div className="max-h-[60vh] space-y-4 overflow-auto">
                        <DialogHeader>
                            <DialogTitle>Buat postingan baru di {channel?.name}</DialogTitle>
                            <DialogDescription>Bagikan tulisan, foto, atau video dengan komunitas. Setelah siap, tekan "Kirim" untuk memulai proses unggah.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                            <Label>Tulis konten</Label>
                            <MinimalTiptap
                                // content={"content"}
                                onChange={setContent}
                                placeholder="Tulis sesuatu di sini..."
                                className="mb-4 min-h-[200px]"
                            />

                            <Label>Unggah foto / video (boleh multiple)</Label>
                            <Input type="file" accept="image/*,video/*" multiple onChange={onFilesChange} className="mt-1" />

                            {previews.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {previews.map((url, idx) => {
                                        const file = files[idx];
                                        const isVideo = file?.type.startsWith("video");
                                        return (
                                            <div key={url} className="relative overflow-hidden rounded-md border">
                                                {isVideo ? <video src={url} controls className="relative h-28 w-full object-cover" /> : <img src={url} alt={`preview-${idx}`} className="relative h-28 w-full object-cover" />}
                                                <button type="button" onClick={() => removePreview(idx)} aria-label={`Hapus preview ${idx + 1}`} className="absolute top-1 right-1 z-10 rounded-md bg-red-500 p-1">
                                                    <XIcon className="h-5 w-5 text-white" />
                                                </button>
                                                {/* progress overlay */}
                                                {typeof uploadProgress[idx] === "number" && uploadProgress[idx] > 0 && uploadProgress[idx] < 100 && (
                                                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/40 px-2 py-1 text-xs text-white">
                                                        <div className="mr-2 h-1 flex-1 overflow-hidden rounded bg-white/30">
                                                            <div className="h-1 bg-green-400" style={{ width: `${uploadProgress[idx]}%` }} />
                                                        </div>
                                                        <div className="w-12 text-right">{uploadProgress[idx]}%</div>
                                                    </div>
                                                )}
                                                {uploadProgress[idx] === 100 && <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/40 px-2 py-1 text-xs text-white">Terunggah</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* sticky footer so tombol tetap terlihat */}
                    <DialogFooter>
                        <Button onClick={handleUpload}>Kirim</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Posts List */}
            <div className="flex-1 bg-white">
                {posts.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                        <p className="text-lg">Belum ada postingan</p>
                        <p className="text-sm">Jadilah yang pertama berbagi!</p>
                    </div>
                ) : (
                    posts.map((post, i) => (
                        <div key={post.id} className="border-b p-6 transition-colors hover:bg-gray-50">
                            {/* Header */}
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Image width={40} height={40} src={post.author.image || ""} alt={post.author.name || ""} className="h-10 w-10 rounded-full" />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">{post.author.name}</span>
                                        <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)} className="rounded p-1 hover:bg-gray-200">
                                        <MoreVertical size={18} />
                                    </button>
                                    {openMenu === post.id && (
                                        <div className="absolute right-0 z-10 mt-1 w-32 rounded border bg-white shadow-lg">
                                            <button onClick={() => handleDeletePost(post.id)} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50" disabled={deletingPost.has(post.id)}>
                                                Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div dangerouslySetInnerHTML={{ __html: post.content }} className="mb-4 text-gray-900" />

                            {/* Images / Video: detect extension and render video tag when needed */}
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
                            <div className="flex items-center gap-6 border-t pt-3">
                                <button onClick={() => handleLike(post.id, i)} disabled={loadingLike.has(post.id)} className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-red-50 disabled:opacity-50">
                                    {loadingLike.has(post.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />}
                                    <span className={likedPosts.has(post.id) ? "font-semibold text-red-500" : "text-gray-600"}>{post._count.likes}</span>
                                </button>

                                <button onClick={() => handleToggleComments(post.id)} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-gray-600 transition-colors hover:bg-blue-50">
                                    {expandedComments.has(post.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    <span>{post._count.comments} Komentar</span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {expandedComments.has(post.id) && (
                                <div className="mt-4 space-y-3 border-t pt-4">
                                    {/* Add Comment Form */}
                                    <div className="flex gap-2">
                                        <Input placeholder="Tulis komentar..." value={commentInput[post.id] || ""} onChange={(e) => setCommentInput((prev) => ({ ...prev, [post.id]: e.target.value }))} disabled={loadingComment.has(post.id)} />
                                        <Button onClick={() => handlePostComment(post.id)} size="sm" disabled={loadingComment.has(post.id)}>
                                            {loadingComment.has(post.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>

                                    {/* Comments List */}
                                    <div className="space-y-3">
                                        {comments[post.id]?.map((comment) => (
                                            <div key={comment.id} className="space-y-2 rounded-lg bg-gray-50 p-3">
                                                {/* Parent Comment */}
                                                <div className="flex gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={comment.author.image} />
                                                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold">{comment.author.name}</p>
                                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                                        <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="mt-1 text-xs text-blue-600 hover:underline">
                                                            Balas
                                                        </button>
                                                    </div>
                                                    <div className="relative">
                                                        <Button onClick={() => setOpenMenu(openMenu === comment.id ? null : comment.id)} variant="ghost" size="icon" className="h-7 w-7">
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                        {openMenu === comment.id && (
                                                            <div className="absolute right-0 z-10 mt-1 w-24 rounded border bg-white shadow-lg">
                                                                <button onClick={() => handleDeleteComment(comment.id, post.id)} className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50">
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Reply Form */}
                                                {replyingTo === comment.id && (
                                                    <div className="ml-11 flex gap-2">
                                                        <Input placeholder="Tulis balasan..." value={replyInput[comment.id] || ""} onChange={(e) => setReplyInput((prev) => ({ ...prev, [comment.id]: e.target.value }))} disabled={loadingReply.has(comment.id)} className="text-xs" />
                                                        <Button onClick={() => handleCreateReply(comment.id, post.id)} size="sm" disabled={loadingReply.has(comment.id)}>
                                                            {loadingReply.has(comment.id) ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Replies List */}
                                                {comment.replies?.map((reply: any) => (
                                                    <div key={reply.id} className="ml-11 flex gap-2 rounded-lg bg-blue-50 p-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={reply.author.image} />
                                                            <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold">{reply.author.name}</p>
                                                            <p className="text-xs text-gray-700">{reply.content}</p>
                                                        </div>
                                                        <Button onClick={() => handleDeleteReply(reply.id, comment.id, post.id)} variant="ghost" size="icon" className="h-6 w-6">
                                                            <XIcon className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
