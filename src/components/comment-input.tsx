import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
interface CommentInputProps {
    authorImage?: string;
    authorName?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit: (comment: string) => Promise<void> | void;
    loading?: boolean;
}

export default function CommentInput({ authorImage, authorName, value, onChange, onSubmit, loading: loadingProp }: CommentInputProps) {
    const [localValue, setLocalValue] = useState(value || "");
    const [loading, setLoading] = useState(false);

    // Sync controlled value
    useEffect(() => {
        if (value !== undefined) setLocalValue(value);
    }, [value]);

    const handleSubmit = async () => {
        const text = localValue.trim();
        if (!text) return;

        if (loadingProp !== undefined) {
            await onSubmit(text);
            onChange?.("");
        } else {
            setLoading(true);
            try {
                await onSubmit(text);
                setLocalValue("");
            } catch (err) {
                console.error("Gagal kirim komentar:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="border-gray-200 pt-4 dark:border-slate-700">
            <div className="flex items-center gap-2">
                <Image width={40} height={40} src={authorImage || "/default-avatar.png"} alt={authorName || "User"} className="h-10 w-10 rounded-full" />

                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => {
                        setLocalValue(e.target.value);
                        onChange?.(e.target.value);
                    }}
                    placeholder="Tambahkan komentar..."
                    className="flex-1 rounded-xl border px-4 py-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <button onClick={handleSubmit} disabled={loading || loadingProp} className="bg-primary-blue hover:bg-primary-blue-hover flex items-center rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-50">
                    {loading || loadingProp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kirim"}
                </button>
            </div>
        </div>
    );
}
