"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Plus, LogIn, Loader2, Search } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import PostItem from "@/components/post-item";
import CommentsDialog from "@/components/comments-dialog";
import { authClient } from "@/lib/auth-client";

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
    author: {
        id: string;
        name: string;
        image: string;
    };
    replies?: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    id: string;
    content: string;
    authorId: string;
    author: {
        id: string;
        name: string;
        image: string;
        role: string;
    };
    createdAt: string;
    images?: Image[];
    likes: Array<{ id: string; userId?: string }>;
    comments: Comment[];
}

export default function HomePage() {
    const { data: session, isPending } = authClient.useSession();
    const searchParams = useSearchParams();

    useEffect(() => {
        const searchQuery = searchParams.get("search");
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagsRes = await axios.get("/api/tags/popular");
                setPopularTags(tagsRes.data.tags);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            }
        };
        fetchTags();
    }, []);

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
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [popularTags, setPopularTags] = useState<{ name: string; count: number }[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>("");
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
                                role: (session.user as any).role || "user",
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
                                        role: (session.user as any).role || "user",
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
                ...(selectedTag && { tag: selectedTag }),
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
    }, [debouncedSearchTerm, selectedTag]);

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

    // SSE for realtime comments and likes on selected post
    useEffect(() => {
        if (!selectedPostForComments) {
            if (eventSource) {
                eventSource.close();
                setEventSource(null);
            }
            return;
        }

        const es = new EventSource(`/api/sse?postId=${selectedPostForComments.id}`);
        setEventSource(es);

        es.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.newComments && data.newComments.length > 0) {
                // Filter out comments that are already in the local state
                setSelectedPostForComments((prev) => {
                    if (!prev) return prev;
                    const existingCommentIds = new Set(prev.comments.flatMap((c) => [c.id, ...(c.replies?.map((r) => r.id) || [])]));
                    const newCommentsOnly = data.newComments.filter((c: any) => !existingCommentIds.has(c.id));
                    if (newCommentsOnly.length === 0) return prev;
                    return {
                        ...prev,
                        comments: [...prev.comments, ...newCommentsOnly],
                    };
                });

                // Update posts list with the same filtering
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p.id === selectedPostForComments.id) {
                            const existingCommentIds = new Set(p.comments.flatMap((c) => [c.id, ...(c.replies?.map((r) => r.id) || [])]));
                            const newCommentsOnly = data.newComments.filter((c: any) => !existingCommentIds.has(c.id));
                            if (newCommentsOnly.length === 0) return p;
                            return { ...p, comments: [...p.comments, ...newCommentsOnly] };
                        }
                        return p;
                    }),
                );
            }

            if (data.newLikes && data.newLikes.length > 0) {
                // Update selectedPostForComments (if needed, but likes are on post)
                // Update posts list
                setPosts((prev) => prev.map((p) => (p.id === selectedPostForComments.id ? { ...p, likes: [...p.likes, ...data.newLikes] } : p)));
            }
        };

        es.onerror = (error) => {
            console.error("SSE Error:", error);
        };

        return () => {
            es.close();
        };
    }, [selectedPostForComments]);

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

    const handleTagSelect = (tagName: string) => {
        if (selectedTag === tagName) {
            setSelectedTag("");
        } else {
            setSelectedTag(tagName);
        }
        setPage(1);
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
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
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
            {/* Filter Tags */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-font-secondary text-sm font-medium dark:text-gray-300">Filter:</span>
                <Button variant={selectedTag === "" ? "default" : "outline"} size="sm" onClick={() => handleTagSelect("")} className="h-8">
                    Semua
                </Button>
                {popularTags.slice(0, 8).map((tag) => (
                    <Button key={tag.name} variant={selectedTag === tag.name ? "default" : "outline"} size="sm" onClick={() => handleTagSelect(tag.name)} className="h-8">
                        #{tag.name}
                    </Button>
                ))}
            </div>
            {/* Daftar Post */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-font-secondary text-center dark:text-gray-400">Memuat postingan...</p>
                ) : posts.length === 0 ? (
                    <p className="text-font-secondary text-center dark:text-gray-400">Tidak ada postingan.</p>
                ) : (
                    posts.map((post) => (
                        <PostItem
                            key={post.id}
                            post={post}
                            onLike={handleLike}
                            onCommentClick={(post) => setSelectedPostForComments(post)}
                            onDelete={async (id) => {
                                try {
                                    await axios.delete(`/api/komunitas?id=${encodeURIComponent(id)}`);
                                    setPosts((prev) => prev.filter((p) => p.id !== id));
                                    if (selectedPostForComments?.id === id) setSelectedPostForComments(null);
                                } catch (err) {
                                    console.error("Gagal hapus post", err);
                                }
                            }}
                            togglingLikes={togglingLikes}
                            session={session}
                        />
                    ))
                )}
                {loadingMore && <p className="text-font-secondary text-center dark:text-gray-400">Memuat lebih banyak...</p>}
            </div>

            <CommentsDialog
                selectedPost={selectedPostForComments}
                onClose={() => setSelectedPostForComments(null)}
                onCommentSubmit={(comment) => {
                    // update local posts state: append comment to the right place
                    setPosts((prev) =>
                        prev.map((p) => {
                            if (p.id === selectedPostForComments?.id) {
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
                }}
                onCommentDelete={(comment) => {
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
                }}
                session={session}
            />
        </div>
    );
}
