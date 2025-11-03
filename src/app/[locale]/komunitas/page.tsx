"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Plus, LogIn, Loader2, MoreHorizontal, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export interface Post {
    id: string;
    content: string;
    authorId: string;
    author: User;
    createdAt: string;
    images?: Image[];
    likes: Array<{ id: string; userId?: string }>;
    comments: Comment[];
    tags: PostTag[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    id: string;
    url: string;
    postId: string;
    status: string;
    createdAt: string;
}

export interface Tag {
    id: string;
    name: string;
    posts: PostTag[];
    createdAt: string;
    updatedAt: string;
}

export interface PostTag {
    id: string;
    postId: string;
    tagId: string;
    post?: Post; // relasi ke Post (optional supaya nggak circular import)
    tag?: Tag;
    createdAt: string;
}

export interface Comment {
    id: string;
    content: string;
    authorId: string;
    postId?: string;
    parentId?: string;
    targetUserId?: string;
    author: User;
    post?: Post;
    parent?: Comment;
    replies?: Comment[];
    targetUser?: User;
    createdAt: string;
    updatedAt: string;
}

const CommentItem = ({ comment, depth = 0, onReply, onDelete }: { comment: Comment; depth?: number; onReply: (comment: Comment) => void; onDelete: (comment: Comment) => void }) => {
    const { data: session } = authClient.useSession();
    const maxDepth = 1; // limit nesting depth to 1 level only

    return (
        <div className={`${depth > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}>
            <div className="flex items-start gap-3 border-b pb-3">
                <Image
                    src={
                        comment.author.image ||
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTE2IDE2QzE3LjEwNDYgMTYgMTggMTUuMTA0NiAxOCAxNEMxOCAxMi44OTU0IDE3LjEwNDYgMTIgMTYgMTJDMTQuODk1NCAxMiAxNCAxMi44OTU0IDE0IDE0QzE0IDE1LjEwNDYgMTQuODk1NCAxNiAxNiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg=="
                    }
                    alt={comment.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{comment.author.name}</span>
                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {depth < maxDepth && (
                                <button className="text-xs text-sky-600 hover:underline" onClick={() => onReply(comment)}>
                                    Reply
                                </button>
                            )}
                            {(comment.author.id === session?.user.id || (session?.user as any).role === "admin") && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <MoreHorizontal className="h-3 w-3" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(comment)}>
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                    {comment.targetUser && <div className="mt-1 text-xs text-gray-500">in reply to {comment.targetUser.name}</div>}
                </div>
            </div>
            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function HomePage() {
    const { data: session, isPending } = authClient.useSession();
    const searchParams = useSearchParams();

    useEffect(() => {
        const searchQuery = searchParams.get("search");
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
    }, [searchParams]);

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [creatingPost, setCreatingPost] = useState(false);

    const [newPost, setNewPost] = useState({
        content: "",
        images: [] as File[],
        imageUrls: [] as string[],
        tags: [] as string[],
    });

    const [tagInput, setTagInput] = useState("");
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [togglingLikes, setTogglingLikes] = useState<Record<string, boolean>>({});
    const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
    const [commentInputValue, setCommentInputValue] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [replyTargetUser, setReplyTargetUser] = useState<{ id: string; name: string } | null>(null);
    const [replyParentId, setReplyParentId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const abortControllerRef = useRef<AbortController | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const handleLike = async (id: string) => {
        if (!session) return;
        if (togglingLikes[id]) return; // prevent spam clicks

        const hasLiked = posts.some((p) => p.id === id && p.likes.some((l) => l.userId === session?.user.id));

        setTogglingLikes((s) => ({ ...s, [id]: true }));

        // Optimistic update. Use a temporary id to avoid colliding with real DB ids.
        const tempLikeId = `temp-${session.user.id}-${Date.now()}`;
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                if (hasLiked) {
                    // jika sudah like → hapus like
                    return { ...p, likes: p.likes.filter((l) => l.userId !== session.user.id) };
                }
                // jika belum like → tambahkan like baru (optimistic)
                return {
                    ...p,
                    likes: [
                        ...p.likes,
                        {
                            id: tempLikeId,
                            postId: id,
                            userId: session.user.id!,
                            createdAt: new Date().toISOString(),
                            user: {
                                id: session.user.id!,
                                name: session.user.name || "",
                                email: session.user.email || "",
                                emailVerified: true,
                                image: session.user.image || "",
                                role: (session.user as any).role || "",
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    ],
                };
            }),
        );

        try {
            await axios.post("/api/komunitas/like", { postId: id });
        } catch (error) {
            console.error("Gagal toggle like:", error);

            // rollback: restore original state
            setPosts((prev) =>
                prev.map((p) => {
                    if (p.id !== id) return p;
                    if (hasLiked) {
                        // originally liked, we removed it optimistically -> add it back if missing
                        if (p.likes.some((l) => l.userId === session.user.id)) return p;
                        return {
                            ...p,
                            likes: [
                                ...p.likes,
                                {
                                    id: `temp-restore-${session.user.id}-${Date.now()}`,
                                    postId: id,
                                    userId: session.user.id!,
                                    createdAt: new Date().toISOString(),
                                    user: {
                                        id: session.user.id!,
                                        name: session.user.name || "",
                                        email: session.user.email || "",
                                        emailVerified: true,
                                        image: session.user.image || "",
                                        role: (session.user as any).role || "",
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                    },
                                },
                            ],
                        };
                    }
                    // originally not liked, we added a temp like -> remove any temp likes
                    return { ...p, likes: p.likes.filter((l) => !(l.userId === session.user.id && String(l.id).startsWith("temp-"))) };
                }),
            );
        } finally {
            setTogglingLikes((s) => {
                const next = { ...s };
                delete next[id];
                return next;
            });
        }
    };

    const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
    const handleCommentChange = (id: string, value: string) => {
        setCommentTexts({ ...commentTexts, [id]: value });
    };
    const handleAddComment = (id: string) => {
        if (!commentTexts[id]) return;
        // setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, comments: (p.comments || 0) + 1 } : p)));
        setCommentTexts({ ...commentTexts, [id]: "" });
    };

    const fetchPosts = async (pageNum: number = 1, append: boolean = false) => {
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            if (!append) setLoading(true);
            else setLoadingMore(true);
            const params = new URLSearchParams({
                page: pageNum.toString(),
                limit: "10",
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
            });
            const res = await axios.get<{ posts: Post[]; hasMore: boolean }>(`/api/komunitas?${params}`, {
                signal: abortControllerRef.current.signal,
            });
            if (append) {
                setPosts((prev) => [...prev, ...res.data.posts]);
            } else {
                setPosts(res.data.posts);
            }
            setHasMore(res.data.hasMore);
            setPage(pageNum);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("Request canceled");
            } else {
                console.error(err);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!session) return;
        fetchPosts(1, false);
    }, [session]);

    useEffect(() => {
        if (!session) return;
        setPage(1);
        fetchPosts(1, false);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMore && !loadingMore && !loading) {
                fetchPosts(page + 1, true);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loadingMore, loading, page]);

    const uploadImagesToS3 = async (files: File[]) => {
        const uploadedUrls: string[] = [];
        for await (const file of files) {
            try {
                const presign = await axios.post(`/api/komunitas/upload`, { fileName: file.name, fileType: file.type });
                const { uploadUrl, fileUrl } = presign.data;

                await axios.put(uploadUrl, file, {
                    headers: { "Content-Type": file.type },
                    onUploadProgress: (e) => {
                        const progress = Math.round((e.loaded * 100) / (e.total || 1));
                        setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
                    },
                });

                uploadedUrls.push(fileUrl);
            } catch (err) {
                console.error("Gagal upload:", err);
            }
        }
        return uploadedUrls;
    };

    const handleTambahPost = async () => {
        if (!newPost.content.trim() || !session) return;

        setCreatingPost(true);

        try {
            let uploadedUrls: string[] = [];
            if (newPost.images.length > 0) {
                uploadedUrls = await uploadImagesToS3(newPost.images);
            }

            const payload = {
                content: newPost.content,
                tags: newPost.tags,
                images: uploadedUrls,
            };

            const res = await axios.post("/api/komunitas", payload);
            if (res.data?.success) {
                const p = res.data.post;
                setPosts((prev) => [p, ...prev]);
                setNewPost({ content: "", images: [], imageUrls: [], tags: [] });
                setTagInput("");
                setOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCreatingPost(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setNewPost({ ...newPost, tags: [...newPost.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setNewPost({ ...newPost, images: Array.from(e.target.files) });
        }
    };

    if (isPending) {
        return <div className="flex h-96 items-center justify-center text-gray-500 dark:text-gray-300">Memeriksa sesi login...</div>;
    }

    if (!session) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center text-center">
                <LogIn className="mb-4 h-12 w-12 text-gray-500" />
                <h2 className="mb-2 text-2xl font-semibold">Kamu belum login</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">Silakan login menggunakan akun Google untuk melanjutkan.</p>
                <Button
                    className="flex items-center gap-2"
                    onClick={() =>
                        authClient.signIn.social({
                            provider: "google",
                            callbackURL: "/",
                            disableRedirect: false,
                        })
                    }
                >
                    <Image src="https://www.svgrepo.com/show/355037/google.svg" width={18} height={18} alt="Google" />
                    Login dengan Google
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold">Beranda</h2>

                {/* Search */}
                <div className="relative max-w-md flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input type="text" placeholder="Cari postingan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 dark:border-gray-700 dark:bg-gray-800" />
                </div>

                {/* Modal Tambah Postingan */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex w-full items-center gap-2 sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Tambah Postingan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="dark:border-gray-700 dark:bg-gray-900">
                        <DialogHeader>
                            <DialogTitle>Tambah Postingan Baru</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3">
                            <Textarea placeholder="Apa yang kamu pikirkan?" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} className="dark:border-gray-700 dark:bg-gray-800" />
                            <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="dark:border-gray-700 dark:bg-gray-800" />

                            {/* preview + progress */}
                            {newPost.images.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-3">
                                    {newPost.images.map((file, idx) => (
                                        <div key={idx} className="relative">
                                            <Image src={URL.createObjectURL(file)} alt={`preview-${idx}`} width={80} height={80} className="rounded-md border object-cover dark:border-gray-700" />
                                            {uploadProgress[file.name] && (
                                                <div className="absolute bottom-0 left-0 h-2 w-full rounded-b-md bg-gray-700/70">
                                                    <div className="h-2 rounded-b-md bg-blue-500 transition-all duration-200" style={{ width: `${uploadProgress[file.name]}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input type="text" placeholder="Tambah tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="dark:border-gray-700 dark:bg-gray-800" />
                                <Button onClick={handleAddTag}>Tambah</Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {newPost.tags.map((tag) => (
                                    <span key={tag} className="rounded-full bg-blue-200 px-2 py-1 text-sm dark:bg-blue-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Button onClick={handleTambahPost} className="w-full" disabled={creatingPost}>
                                {creatingPost ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : null}
                                Kirim Postingan
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            {/* Daftar Post */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Memuat postingan...</p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada postingan.</p>
                ) : (
                    posts.map((post, i) => (
                        <Card key={i} className="transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={
                                            post.author.image ||
                                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcgMjAgMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo="
                                        }
                                        alt={post.author.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                            {post.author.name}
                                            <span className={`rounded-full px-2 py-0.5 text-xs ${post.author.role === "admin" ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>{post.author.role}</span>
                                        </CardTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.createdAt}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-2">
                                        {(post.authorId === session?.user.id || (session?.user as any).role === "admin") && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onSelect={async () => {
                                                            try {
                                                                await axios.delete(`/api/komunitas?id=${encodeURIComponent(post.id)}`);
                                                                setPosts((prev) => prev.filter((p) => p.id !== post.id));
                                                                if (selectedPostForComments?.id === post.id) setSelectedPostForComments(null);
                                                            } catch (err) {
                                                                console.error("Gagal hapus post", err);
                                                            }
                                                        }}
                                                    >
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="mb-4">{post.content}</p>

                                {post.images && post.images.length > 0 && (
                                    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                        {post.images.map((v, index) => (
                                            <div key={v.id} className="relative aspect-video cursor-pointer overflow-hidden rounded-xl transition-opacity hover:opacity-90" onClick={() => setSelectedImage(v.url)}>
                                                <Image src={v.url} alt={`Post image ${v.id}`} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" priority={index === 0} loading={index < 3 ? "eager" : "lazy"} />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center space-x-6 text-sm">
                                    <button onClick={() => handleLike(post.id)} disabled={!!togglingLikes[post.id]} className={`flex items-center space-x-1 transition ${togglingLikes[post.id] ? "pointer-events-none opacity-50" : "hover:text-red-500"}`} aria-busy={!!togglingLikes[post.id]}>
                                        <Heart className="h-4 w-4" />
                                        <span>{post.likes.length}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedPostForComments(post);
                                            setCommentInputValue("");
                                            setReplyTargetUser(null);
                                            setReplyParentId(null);
                                        }}
                                        className={`flex items-center space-x-1 transition hover:text-sky-500`}
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        <span>{post.comments.length}</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
                {loadingMore && <p className="text-center text-gray-500">Memuat lebih banyak...</p>}
            </div>{" "}
            {/* Comments dialog (different layout) */}
            <Dialog
                open={!!selectedPostForComments}
                onOpenChange={(open) => {
                    if (!open) setSelectedPostForComments(null);
                }}
            >
                <DialogContent className="flex h-[80vh] w-full max-w-4xl flex-col">
                    <DialogHeader>
                        <DialogTitle>Komentar</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
                        {/* Composer */}
                        <div className="shrink-0 border-b p-4">
                            <Textarea value={commentInputValue} onChange={(e) => setCommentInputValue(e.target.value)} placeholder="Tulis komentar di sini..." className="dark:border-gray-700 dark:bg-gray-800" />
                            <div className="mt-2 flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={async () => {
                                        if (!selectedPostForComments || !commentInputValue.trim()) return;
                                        setPostingComment(true);
                                        try {
                                            const res = await axios.post("/api/komunitas/komentar", { postId: selectedPostForComments.id, content: commentInputValue.trim(), targetUserId: replyTargetUser?.id ?? null, parentId: replyParentId });
                                            if (res.data?.success) {
                                                const comment = res.data.comment as Comment;
                                                // update local posts state: append comment to the right place
                                                setPosts((prev) =>
                                                    prev.map((p) => {
                                                        if (p.id === selectedPostForComments.id) {
                                                            if (comment.parentId) {
                                                                // it's a reply, add to parent's replies
                                                                return {
                                                                    ...p,
                                                                    comments: p.comments.map((c) => (c.id === comment.parentId ? { ...c, replies: [...(c.replies || []), comment] } : c)),
                                                                };
                                                            } else {
                                                                // it's a top-level comment
                                                                return { ...p, comments: [...(p.comments || []), comment] };
                                                            }
                                                        }
                                                        return p;
                                                    }),
                                                );
                                                // update selectedPostForComments
                                                setSelectedPostForComments((prev) => {
                                                    if (!prev) return prev;
                                                    if (comment.parentId) {
                                                        // add to parent's replies
                                                        return {
                                                            ...prev,
                                                            comments: prev.comments.map((c) => (c.id === comment.parentId ? { ...c, replies: [...(c.replies || []), comment] } : c)),
                                                        };
                                                    } else {
                                                        // add as top-level comment
                                                        return { ...prev, comments: [...(prev.comments || []), comment] };
                                                    }
                                                });
                                                setCommentInputValue("");
                                                setReplyTargetUser(null);
                                                setReplyParentId(null);
                                            }
                                        } catch (err) {
                                            console.error("Gagal kirim komentar", err);
                                        } finally {
                                            setPostingComment(false);
                                        }
                                    }}
                                    disabled={postingComment}
                                >
                                    {postingComment ? "Mengirim..." : "Kirim Komentar"}
                                </Button>
                                <Button variant="ghost" onClick={() => setSelectedPostForComments(null)}>
                                    Tutup
                                </Button>
                            </div>
                        </div>

                        {/* Comments list */}
                        <div className="flex-1 overflow-auto p-4">
                            <h3 className="mb-4 text-lg font-semibold">Komentar</h3>
                            {!selectedPostForComments ? (
                                <p className="text-sm text-gray-500">Pilih postingan untuk melihat komentar.</p>
                            ) : selectedPostForComments.comments.length === 0 ? (
                                <p className="text-sm text-gray-500">Belum ada komentar. Jadilah yang pertama!</p>
                            ) : (
                                <div className="space-y-4">
                                    {selectedPostForComments.comments.map((c) => (
                                        <CommentItem
                                            key={c.id}
                                            comment={c}
                                            onReply={(comment) => {
                                                setReplyTargetUser({ id: comment.author.id, name: comment.author.name });
                                                setReplyParentId(comment.id);
                                                setCommentInputValue(`@${comment.author.name} `);
                                            }}
                                            onDelete={async (comment) => {
                                                try {
                                                    await axios.delete("/api/komunitas/komentar", { data: { commentId: comment.id } });
                                                    // remove from selectedPostForComments and posts
                                                    setSelectedPostForComments((prev) => {
                                                        if (!prev) return prev;
                                                        if (comment.parentId) {
                                                            // remove from parent's replies
                                                            return {
                                                                ...prev,
                                                                comments: prev.comments.map((pc) => (pc.id === comment.parentId ? { ...pc, replies: (pc.replies || []).filter((r) => r.id !== comment.id) } : pc)),
                                                            };
                                                        } else {
                                                            // remove from top-level comments
                                                            return { ...prev, comments: prev.comments.filter((x) => x.id !== comment.id) };
                                                        }
                                                    });
                                                    setPosts((prev) =>
                                                        prev.map((p) => {
                                                            if (p.id === selectedPostForComments?.id) {
                                                                if (comment.parentId) {
                                                                    // remove from parent's replies
                                                                    return {
                                                                        ...p,
                                                                        comments: p.comments.map((pc) => (pc.id === comment.parentId ? { ...pc, replies: (pc.replies || []).filter((r) => r.id !== comment.id) } : pc)),
                                                                    };
                                                                } else {
                                                                    // remove from top-level comments
                                                                    return { ...p, comments: p.comments.filter((x) => x.id !== comment.id) };
                                                                }
                                                            }
                                                            return p;
                                                        }),
                                                    );
                                                } catch (err) {
                                                    console.error("Gagal hapus komentar", err);
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Image dialog */}
            <Dialog
                open={!!selectedImage}
                onOpenChange={(open) => {
                    if (!open) setSelectedImage(null);
                }}
            >
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Gambar</DialogTitle>
                    </DialogHeader>
                    {selectedImage && <Image src={selectedImage} alt="Full image" width={800} height={600} className="h-auto w-full rounded-lg" />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
