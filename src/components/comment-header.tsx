"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Heart, MoreVertical, MessageCircle, Trash2, Forward } from "lucide-react";
import Image from "next/image";
import { getPostById } from "@/app/[locale]/(page)/komunitas/[channel]/actions";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentInput from "./comment-input";

export default function CommentHeader() {
    const params = useParams<{ postId: string }>();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState(false);

    // state input komentar
    const [commentInput, setCommentInput] = useState("");
    const [loadingComment, setLoadingComment] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getPostById(params.postId);
                setPost(data);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [params.postId]);

    const handlePostComment = async () => {
        if (!commentInput.trim()) return;
        setLoadingComment(true);

        // simulasi kirim komentar ke API
        try {
            console.log("Komentar dikirim:", commentInput);
            // nanti bisa ganti fetch() ke endpoint API
            setCommentInput("");
        } catch (error) {
            console.error("Gagal kirim komentar:", error);
        } finally {
            setLoadingComment(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );

    if (!post)
        return (
            <div className="flex justify-center py-20 text-gray-500">
                Post tidak ditemukan
            </div>
        );



    return (
        <div className="max-w-4xl w-full mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Post</h1>

            {/* Kartu Post */}
            <div className="rounded-lg bg-white p-2 transition-all hover:bg-gray-50 sm:p-4 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:shadow-none">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <Image
                            width={40}
                            height={40}
                            src={post.author.image || "/default-avatar.png"}
                            alt={post.author.name || ""}
                            className="h-10 w-10 shrink-0 rounded-full"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-gray-900 dark:text-white">
                                {post.author.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => console.log("hapus post")}
                                className="text-red-600 transition-colors focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Konten Post */}
                <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="wrap-break-word prose dark:prose-invert prose-p:mb-2 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white mb-4 max-w-none text-gray-700 dark:text-slate-300"
                />

                {/* Gambar */}
                {post.images?.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {post.images.map((image: any, idx: number) => {
                            const url = `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${image.url}`;
                            const ext = image.url.split(".").pop()?.toLowerCase() || "";
                            const isVideo = ["mp4", "webm", "ogg"].includes(ext);
                            return isVideo ? (
                                <video
                                    key={idx}
                                    src={url}
                                    controls
                                    className="h-40 w-full rounded-lg object-cover"
                                />
                            ) : (
                                <div
                                    key={idx}
                                    className="group relative h-40 w-full overflow-hidden rounded-lg"
                                >
                                    <Image
                                        src={url}
                                        alt="Post image"
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center pb-4 justify-start gap-2 border-gray-200 dark:border-slate-700">
                    <button className="flex items-center gap-1 rounded-full px-3 py-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400">
                        <Heart
                            className={`h-4 w-4 ${post.isLikedByUser ? "fill-red-500 text-red-500" : ""}`}
                        />
                        <span
                            className={`text-sm ${post.isLikedByUser ? "font-semibold text-red-500" : ""
                                }`}
                        >
                            {post._count?.likes || 0}
                        </span>
                    </button>

                    <Link
                        href={`/komunitas/${post.channel?.name}/${post.id}`}
                        className="flex items-center gap-1 rounded-full px-3 py-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{post._count?.comments || 0}</span>
                    </Link>

                    <button className="flex items-center gap-1 rounded-full px-3 py-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600 dark:text-slate-400 dark:hover:bg-green-500/10 dark:hover:text-green-400">
                        <Forward className="h-4 w-4" />
                    </button>
                </div>

                {/* Input Komentar */}
                <CommentInput
                    authorImage={post.author.image}
                    authorName={post.author.name}
                    onSubmit={handlePostComment}
                />
            </div>
        </div>
    );
}
