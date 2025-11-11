import { Channel } from "@/generated/prisma/client";
import { Hash } from "lucide-react";
import Image from "next/image";

interface ChannelHeaderProps {
    authorImage?: string;
    authorName?: string;
    channel: Channel | null;
    searchQuery: string;
    isSearching: boolean;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    onCreatePost: () => void;
}

const ChannelHeader = ({ authorImage, authorName, channel, searchQuery, isSearching, onSearchChange, onSearch, onCreatePost }: ChannelHeaderProps) => {
    return (
        <>
            <div className="mb-6 flex items-center gap-5">
                <Hash size={60} />
                <div>
                    <h1 className="text-font-primary text-4xl font-bold tracking-wide dark:text-white">{channel?.name}</h1>
                    <p className="text-font-secondary mt-1 text-sm dark:text-slate-400">{channel?.description}</p>
                </div>
            </div>

            <div className="rounded-xl border">
                <div className="p-4">
                    <div className="flex flex-row items-center gap-4">
                        <Image width={40} height={40} src={authorImage || "/default-avatar.png"} alt={authorName || "User"} className="h-10 w-10 rounded-full" />
                        <button onClick={onCreatePost} className="flex-1 rounded-md border px-4 py-2 text-start">
                            Buat Postingan Baru
                        </button>
                        <button className="bg-primary-blue-disable flex rounded-md px-4 py-2 font-semibold text-gray-100">Buat</button>
                    </div>
                </div>
            </div>

            <div className="flex py-4">
                <div className="w-full border-b-2 py-4">
                    <div className="flex flex-row gap-2 px-2">
                        <button className="rounded-md border px-4 py-2">Postingan Top</button>
                        <button className="rounded-md border px-4 py-2">Terbaru</button>
                    </div>
                </div>
            </div>

            {/* <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                    <Input
                        placeholder="Cari postingan..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && onSearch()}
                        className="border-gray-200 bg-gray-50 pl-10 text-gray-900 placeholder-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                    />
                </div>
                <Button
                    onClick={onSearch}
                    disabled={isSearching}
                    variant="outline"
                    className="border-gray-200 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {isSearching ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mencari...
                        </>
                    ) : (
                        "Cari"
                    )}
                </Button>
            </div> */}
        </>
    );
};

export default ChannelHeader;
