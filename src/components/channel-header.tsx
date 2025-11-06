// components/ChannelHeader.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Loader2 } from "lucide-react";
import { Channel } from "@/generated/prisma/client";

interface ChannelHeaderProps {
    channel: Channel | null;
    searchQuery: string;
    isSearching: boolean;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    onCreatePost: () => void;
}

const ChannelHeader = ({
    channel,
    searchQuery,
    isSearching,
    onSearchChange,
    onSearch,
    onCreatePost,
}: ChannelHeaderProps) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 backdrop-blur-sm transition-colors dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">#{channel?.name}</h1>
                    <p className="mt-1 text-gray-600 dark:text-slate-400">{channel?.description}</p>
                </div>
                <Button onClick={onCreatePost} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 sm:w-auto">
                    <Upload className="h-4 w-4" />
                    Buat Post
                </Button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
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
            </div>
        </div>
    );
}

export default ChannelHeader;