"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface CommentInputProps {
    authorImage?: string;
    authorName?: string;
    onSubmit: (comment: string) => Promise<void> | void;
}

export default function CommentInput({ authorImage, authorName, onSubmit }: CommentInputProps) {
    const [commentInput, setCommentInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!commentInput.trim()) return;
        setLoading(true);

        try {
            await onSubmit(commentInput);
            setCommentInput("");
        } catch (error) {
            console.error("Gagal kirim komentar:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" border-gray-200 dark:border-slate-700">
            <div className="flex flex-row items-center gap-2">
                <Image
                    width={40}
                    height={40}
                    src={authorImage || "/default-avatar.png"}
                    alt={authorName || "User"}
                    className="h-10 w-10 shrink-0 rounded-full"
                />

                <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Tambahkan Komentar"
                    className="flex-1 rounded-xl border px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-orange-500 flex rounded-xl border px-4 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Balas"}
                </button>
            </div>
        </div>
    );
}
