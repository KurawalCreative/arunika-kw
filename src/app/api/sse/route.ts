import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();
    const url = new URL(req.url);
    const postId = url.searchParams.get('postId');

    if (!postId) {
        return new Response('postId required', { status: 400 });
    }

    let lastCommentTimestamp: Date | null = null;
    let lastLikeTimestamp: Date | null = null;

    const stream = new ReadableStream({
        start(controller) {
            const interval = setInterval(async () => {
                try {
                    // Check for new comments on this post
                    const whereComment: {
                        postId: string;
                        createdAt?: { gt: Date };
                    } = { postId };
                    if (lastCommentTimestamp) whereComment.createdAt = { gt: lastCommentTimestamp };
                    const newComments = await prisma.comment.findMany({
                        where: whereComment,
                        include: {
                            author: true,
                            replies: {
                                include: { author: true },
                                orderBy: { createdAt: 'asc' },
                            },
                        },
                        orderBy: { createdAt: 'asc' },
                        take: 3, // Limit per poll
                    });

                    // Check for new likes on this post
                    const whereLike: {
                        postId: string;
                        createdAt?: { gt: Date };
                    } = { postId };
                    if (lastLikeTimestamp) whereLike.createdAt = { gt: lastLikeTimestamp };
                    const newLikes = await prisma.like.findMany({
                        where: whereLike,
                        include: { user: true },
                        orderBy: { createdAt: 'asc' },
                        take: 3,
                    });

                    // Send updates if any
                    if (newComments.length > 0 || newLikes.length > 0) {
                        const data = JSON.stringify({
                            newComments,
                            newLikes,
                        });
                        controller.enqueue(encoder.encode(`data: ${data}\n\n`));

                        // Update last timestamps
                        if (newComments.length > 0) {
                            lastCommentTimestamp = newComments[newComments.length - 1].createdAt;
                        }
                        if (newLikes.length > 0) {
                            lastLikeTimestamp = newLikes[newLikes.length - 1].createdAt;
                        }
                    }
                } catch (error) {
                    console.error('SSE Error:', error);
                }
            }, 10000); // Poll every 10 seconds

            req.signal.addEventListener('abort', () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}