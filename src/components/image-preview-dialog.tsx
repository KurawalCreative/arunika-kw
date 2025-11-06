import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface ImagePreviewDialogProps {
    isOpen: boolean;
    imageUrl: string | null;
    onOpenChange: (open: boolean) => void;
}

export default function ImagePreviewDialog({ isOpen, imageUrl, onOpenChange }: ImagePreviewDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl border-gray-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-900">
                <DialogTitle className="sr-only">Image Preview</DialogTitle>
                {imageUrl && (
                    <div className="relative flex w-full items-center justify-center bg-black">
                        <Image src={imageUrl} alt="Preview" width={1200} height={800} sizes="90vw" className="h-auto w-full object-contain" priority />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}