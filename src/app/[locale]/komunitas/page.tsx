"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Plus, LogIn, Loader2 } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import crypto from "crypto";

export interface Post {
    id: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author: Author;
    likes: Like[];
    comments: Comment[];
    tags: Tag[];
    images: Image[];
}

export interface Author {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface Like {
    id: string;
    userId: string;
    postId: string;
    createdAt: string;
    user: User;
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
    targetUserId?: string;
    author: User;
    post?: Post;
    targetUser?: User;
    createdAt: string;
    updatedAt: string;
}

export default function HomePage() {
    const { data: session, isPending } = authClient.useSession();

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

    const handleLike = async (id: string) => {
        const hasLiked = posts.some((p) => p.id === id && p.likes.some((l) => l.userId === session?.user.id));

        // Optimistic update
        setPosts((prev) =>
            prev.map((p) =>
                p.id === id
                    ? hasLiked
                        ? {
                              // jika sudah like → hapus like
                              ...p,
                              likes: p.likes.filter((l) => l.userId !== session?.user.id),
                          }
                        : {
                              // jika belum like → tambahkan like baru
                              ...p,
                              likes: [
                                  ...p.likes,
                                  {
                                      id: session?.user.id!,
                                      postId: id,
                                      userId: session?.user.id!,
                                      createdAt: new Date().toISOString(),
                                      user: {
                                          id: session?.user.id!,
                                          name: session?.user.name || "",
                                          email: session?.user.email || "",
                                          emailVerified: true,
                                          image: session?.user.image || "",
                                          role: (session?.user as any).role || "",
                                          createdAt: new Date().toISOString(),
                                          updatedAt: new Date().toISOString(),
                                      },
                                  },
                              ],
                          }
                    : p,
            ),
        );

        try {
            await axios.post("/api/komunitas/like", { postId: id });
        } catch (error) {
            console.error("Gagal toggle like:", error);

            // rollback ke kondisi semula
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? hasLiked
                            ? {
                                  ...p,
                                  likes: [
                                      ...p.likes,
                                      {
                                          id: session?.user.id!,
                                          postId: id,
                                          userId: session?.user.id!,
                                          createdAt: new Date().toISOString(),
                                          user: {
                                              id: session?.user.id!,
                                              name: session?.user.name || "",
                                              email: session?.user.email || "",
                                              emailVerified: true,
                                              image: session?.user.image || "",
                                              role: (session?.user as any).role || "",
                                              createdAt: new Date().toISOString(),
                                              updatedAt: new Date().toISOString(),
                                          },
                                      },
                                  ],
                              }
                            : {
                                  ...p,
                                  likes: p.likes.filter((l) => l.userId !== session?.user.id),
                              }
                        : p,
                ),
            );
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

    useEffect(() => {
        if (!session) return;

        const fetchPosts = async () => {
            try {
                const res = await axios.get<Post[]>("/api/komunitas");
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [session]);

    const uploadImagesToS3 = async (files: File[]) => {
        const uploadedUrls: string[] = [];
        for await (const file of files) {
            try {
                const res = await axios.get(`/api/komunitas?mode=url&fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
                const { uploadUrl, fileUrl } = res.data;

                await axios.put(uploadUrl, await file.arrayBuffer(), {
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
        return <div className="flex justify-center items-center h-96 text-gray-500 dark:text-gray-300">Memeriksa sesi login...</div>;
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                <LogIn className="w-12 h-12 mb-4 text-gray-500" />
                <h2 className="text-2xl font-semibold mb-2">Kamu belum login</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Silakan login menggunakan akun Google untuk melanjutkan.</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl font-semibold">Beranda</h2>

                {/* Modal Tambah Postingan */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Postingan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="dark:bg-gray-900 dark:border-gray-700">
                        <DialogHeader>
                            <DialogTitle>Tambah Postingan Baru</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3">
                            <Textarea placeholder="Apa yang kamu pikirkan?" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} className="dark:bg-gray-800 dark:border-gray-700" />
                            <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="dark:bg-gray-800 dark:border-gray-700" />

                            {/* preview + progress */}
                            {newPost.images.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {newPost.images.map((file, idx) => (
                                        <div key={idx} className="relative">
                                            <Image src={URL.createObjectURL(file)} alt={`preview-${idx}`} width={80} height={80} className="rounded-md object-cover border dark:border-gray-700" />
                                            {uploadProgress[file.name] && (
                                                <div className="absolute bottom-0 left-0 w-full bg-gray-700/70 h-2 rounded-b-md">
                                                    <div className="bg-blue-500 h-2 rounded-b-md transition-all duration-200" style={{ width: `${uploadProgress[file.name]}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input type="text" placeholder="Tambah tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="dark:bg-gray-800 dark:border-gray-700" />
                                <Button onClick={handleAddTag}>Tambah</Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {newPost.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-blue-200 rounded-full text-sm dark:bg-blue-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Button onClick={handleTambahPost} className="w-full" disabled={creatingPost}>
                                {creatingPost ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> : null}
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
                    <p className="text-center text-gray-500">Belum ada postingan.</p>
                ) : (
                    posts.map((post, i) => (
                        <Card key={i} className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Image src={post.author.image} alt={post.author.name} width={40} height={40} className="rounded-full" />
                                    <div>
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            {post.author.name}
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${post.author.role === "admin" ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>{post.author.role}</span>
                                        </CardTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.createdAt}</p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="mb-4">{post.content}</p>

                                {post.images && post.images.length > 0 && (
                                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {post.images.map((v, i) => (
                                            <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                                                <Image src={v.url} alt={`Post image ${i}`} fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center space-x-6 text-sm">
                                    <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1 hover:text-red-500 transition">
                                        <Heart className="h-4 w-4" />
                                        <span>{post.likes.length}</span>
                                    </button>
                                    <div className="flex items-center space-x-1 text-gray-500">
                                        <MessageCircle className="h-4 w-4" />
                                        <span>{post.comments.length}</span>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                    <input type="text" placeholder="Tulis komentar..." value={commentTexts[post.id] || ""} onChange={(e) => handleCommentChange(post.id, e.target.value)} className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700" />
                                    <Button size="sm" onClick={() => handleAddComment(post.id)} className="w-full sm:w-auto">
                                        Kirim
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
