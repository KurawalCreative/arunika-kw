import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Loader2, Send, Trash2, Heart, MessageCircle } from "lucide-react";
import ReplyItem from "./reply-item";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

dayjs.extend(relativeTime);
dayjs.locale("id");

interface CommentItemProps {
    comment: any;
    postId: string;
    replyingTo: string | null;
    replyInput: string;
    loadingReply: boolean;
    deletingComment: boolean;
    deletingReply: string[];
    openMenu: string | null;
    openReplyMenu: string | null;
    currentUserId?: string;
    onReplyTo: (commentId: string | null) => void;
    onReplyInputChange: (value: string) => void;
    onCreateReply: () => void;
    onDeleteComment: () => void;
    onDeleteReply: (replyId: string, commentId: string) => void;
    onOpenMenuChange: (id: string | null) => void;
    onOpenReplyMenuChange: (id: string | null) => void;
}

export default function CommentItem({ comment, postId, replyingTo, replyInput, loadingReply, deletingComment, deletingReply, openMenu, openReplyMenu, currentUserId, onReplyTo, onReplyInputChange, onCreateReply, onDeleteComment, onDeleteReply, onOpenMenuChange, onOpenReplyMenuChange }: CommentItemProps) {
    return (
        <div className="space-y-2 rounded-lg bg-gray-50 p-3 transition-colors dark:bg-slate-900/50">
            {/* Parent Comment */}
            <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.author.image} />
                    <AvatarFallback className="bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-white">{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.author.name}</p>
                            <p className="text-xs text-gray-500">
                                <Tooltip>
                                    <TooltipTrigger>{dayjs(comment.createdAt).fromNow()}</TooltipTrigger>
                                    <TooltipContent>{new Date(comment.createdAt).toLocaleString()}</TooltipContent>
                                </Tooltip>
                            </p>
                        </div>

                        <p className="wrap-break-words text-text-primary text-base dark:text-slate-300">{comment.content}</p>

                        {/* Like Comment */}
                        <div className="mt-3 flex items-center gap-1">
                            {/* Like Button */}
                            <button className="group hover:bg-accent-coral/10 hover:text-accent-coral-hover dark:hover:bg-accent-coral/10 dark:hover:text-accent-coral-hover flex items-center gap-2 rounded-full px-3 py-2 text-gray-500 transition-all duration-200 dark:text-slate-400">
                                <Heart className="group-hover:text-accent-coral-hover dark:group-hover:text-accent-coral-hover h-4 w-4 text-gray-500 transition-colors dark:text-slate-400" />
                            </button>

                            {/* Comment Button */}
                            <div onClick={() => onReplyTo(replyingTo === comment.id ? null : comment.id)} className="group hover:bg-primary-blue/10 hover:text-primary-blue-hover dark:hover:bg-primary-blue/10 dark:hover:text-primary-blue-hover flex items-center gap-2 rounded-full px-3 py-2 text-gray-500 transition-all duration-200 select-none dark:text-slate-400">
                                <MessageCircle className="group-hover:text-primary-blue-hover dark:group-hover:text-primary-blue-hover h-4 w-4 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
                {currentUserId === comment.author.id && (
                    <DropdownMenu open={openMenu === comment.id} onOpenChange={(open) => onOpenMenuChange(open ? comment.id : null)}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white" disabled={deletingComment}>
                                <MoreVertical className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onDeleteComment} className="text-red-600 transition-colors focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10" disabled={deletingComment}>
                                {deletingComment ? (
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

            {/* Reply Form */}
            {replyingTo === comment.id && (
                <div className="ml-6 flex flex-col items-center gap-2 sm:ml-11 sm:flex-row">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={comment.author.image} />
                        <AvatarFallback className="bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-white">{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <Input placeholder="Tulis balasan..." value={replyInput} onChange={(e) => onReplyInputChange(e.target.value)} disabled={loadingReply} className="border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder-gray-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500" />
                    <Button onClick={onCreateReply} size="sm" disabled={loadingReply} className="bg-primary-blue hover:bg-primary-blue-hover">
                        {loadingReply ? <Loader2 className="h-3 w-3 animate-spin" /> : <p>Balas</p>}
                    </Button>
                </div>
            )}

            {/* Replies List */}
            {comment.replies?.map((reply: any) => (
                <ReplyItem key={reply.id} reply={reply} commentId={comment.id} postId={postId} deletingReply={deletingReply.includes(reply.id)} openReplyMenu={openReplyMenu} currentUserId={currentUserId} onDeleteReply={(replyId) => onDeleteReply(replyId, comment.id)} onOpenReplyMenuChange={onOpenReplyMenuChange} />
            ))}
        </div>
    );
}
