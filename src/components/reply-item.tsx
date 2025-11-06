// components/ReplyItem.tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Loader2, Trash2 } from "lucide-react";

interface ReplyItemProps {
    reply: any;
    commentId: string;
    postId: string;
    deletingReply: boolean;
    openReplyMenu: string | null;
    currentUserId?: string;
    onDeleteReply: (replyId: string) => void;
    onOpenReplyMenuChange: (id: string | null) => void;
}

export default function ReplyItem({ reply, commentId, postId, deletingReply, openReplyMenu, currentUserId, onDeleteReply, onOpenReplyMenuChange }: ReplyItemProps) {
    return (
        <div className="ml-6 flex gap-2 rounded-lg bg-gray-100 p-2 transition-colors sm:ml-11 dark:bg-slate-800/50">
            <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={reply.author.image} />
                <AvatarFallback className="bg-gray-200 text-xs text-gray-900 dark:bg-slate-700 dark:text-white">{reply.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">{reply.author.name}</p>
                <p className="text-xs wrap-break-words text-gray-700 dark:text-slate-300">{reply.content}</p>
            </div>
            {currentUserId === reply.author.id && (
                <DropdownMenu open={openReplyMenu === reply.id} onOpenChange={(open) => onOpenReplyMenuChange(open ? reply.id : null)}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                            disabled={deletingReply}
                        >
                            <MoreVertical className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDeleteReply(reply.id)} className="text-red-600 transition-colors focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10" disabled={deletingReply}>
                            {deletingReply ? (
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
            )}
        </div>
    );
}