// components/CreatePostDialog.tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MinimalTiptap } from "@/components/ui/shadcn-io/minimal-tiptap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon, Loader2 } from "lucide-react";
import { Channel } from "@/generated/prisma/client";

interface CreatePostDialogProps {
    isOpen: boolean;
    channel: Channel | null;
    content: string;
    files: File[];
    previews: string[];
    isUploading: boolean;
    onOpenChange: (open: boolean) => void;
    onContentChange: (value: string) => void;
    onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemovePreview: (index: number) => void;
    onUpload: () => void;
}

const CreatePostDialog = ({
    isOpen,
    channel,
    content,
    files,
    previews,
    isUploading,
    onOpenChange,
    onContentChange,
    onFilesChange,
    onRemovePreview,
    onUpload,
}: CreatePostDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="border-gray-200 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
                <div className="max-h-[60vh] space-y-4 overflow-auto">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">Buat postingan di #{channel?.name}</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-slate-400">Bagikan pemikiran Anda dengan komunitas</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label className="text-gray-700 dark:text-slate-300">Konten</Label>
                            <MinimalTiptap onChange={onContentChange} placeholder="Tulis sesuatu..." className="mt-2 min-h-[150px]" />
                        </div>

                        <div>
                            <Label className="text-gray-700 dark:text-slate-300">Media</Label>
                            <Input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={onFilesChange}
                                className="mt-2 border-gray-200 bg-gray-50 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>

                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {previews.map((url, idx) => (
                                    <div key={url} className="group relative">
                                        {files[idx]?.type.startsWith("video") ? (
                                            <video src={url} className="h-24 w-full rounded-lg object-cover" />
                                        ) : (
                                            <img src={url} alt={`preview-${idx}`} className="h-24 w-full rounded-lg object-cover" />
                                        )}
                                        <button
                                            onClick={() => onRemovePreview(idx)}
                                            className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <XIcon className="h-5 w-5 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onUpload} disabled={isUploading} className="w-full bg-blue-600 transition-colors hover:bg-blue-700 disabled:opacity-50">
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mengunggah...
                            </>
                        ) : (
                            "Posting"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreatePostDialog;