"use client";

import Image from "next/image";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CommentInput from "./comment-input";
import { Session } from "next-auth";
import { useState } from "react";

interface CommentHeaderProps {
  post: any;
  session: Session | null;
  commentInput: string;
  setCommentInput: (value: string) => void;
  onPostComment: () => void;
  loadingComment: boolean;
}

export default function CommentHeader({ post, session, commentInput, setCommentInput, onPostComment, loadingComment }: CommentHeaderProps) {
  const [openMenu, setOpenMenu] = useState(false);

  if (!post) return null;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Post</h1>

      <div className="rounded-lg bg-white p-4 dark:bg-slate-800/50">
        {/* Header Post */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              width={40}
              height={40}
              src={post.author.image || "/default-avatar.png"}
              alt={post.author.name || ""}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Konten Post */}
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="prose dark:prose-invert mb-4"
        />

        {/* Images */}
        {post.images?.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {post.images.map((img: any, idx: number) => (
              <Image
                key={idx}
                src={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${img.url}`}
                alt="Post image"
                width={300}
                height={200}
                className="rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {/* Input Komentar */}
        <CommentInput
          authorImage={session?.user?.image || "/default-avatar.png"}
          authorName={session?.user?.name || "User"}
          value={commentInput}
          onChange={setCommentInput}
          onSubmit={onPostComment}
          loading={loadingComment}
        />
      </div>

      
    </div>
  );
}
