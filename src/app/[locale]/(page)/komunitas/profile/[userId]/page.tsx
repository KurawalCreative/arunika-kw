"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, MapPin, Calendar, Heart, MessageCircle, Users, UserPlus, UserMinus, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PostItem from "@/components/post-item";
import { authClient } from "@/lib/auth-client";
import { Post, PostImage, User } from "@/generated/prisma/client";

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [profile, setProfile] = useState<(User & { _count: { followers: number; following: number; Post: number } }) | null>(null);
    const [posts, setPosts] = useState<(Post & { images: PostImage[]; likedByUser: boolean; likesCount: number; author: User })[]>([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);
    const [togglingFollow, setTogglingFollow] = useState(false);

    const profileUserId = params.userId as string;

    // Safely read NextAuth runtime fields from session.user
    const sessUser = (session?.user as any) || {};
    const sessionUserId = sessUser.id as string | undefined;
    const sessionUserRole = sessUser.role as string | undefined;

    const isOwnProfile = sessionUserId === profileUserId;

    useEffect(() => {
        if (!profileUserId) return;
        fetchProfile();
    }, [profileUserId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const [profileRes, postsRes] = await Promise.all([axios.get(`/api/komunitas/profile/${profileUserId}`), axios.get(`/api/komunitas/profile/${profileUserId}/posts`)]);

            setProfile(profileRes.data.user);
            setPosts(postsRes.data.posts);

            // Check if current user is following this profile
            if (sessionUserId && sessionUserId !== profileUserId) {
                const followRes = await axios.get(`/api/komunitas/follow/check?followerId=${sessionUserId}&followingId=${profileUserId}`);
                setFollowing(followRes.data.isFollowing);
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!sessionUserId || togglingFollow) return;

        setTogglingFollow(true);
        try {
            if (following) {
                await axios.delete(`/api/komunitas/follow`, {
                    data: { followingId: profileUserId },
                });
                setFollowing(false);
                setProfile((prev) => (prev ? { ...prev, _count: { ...prev._count, followers: prev._count.followers - 1 } } : null));
            } else {
                await axios.post(`/api/komunitas/follow`, { followingId: profileUserId });
                setFollowing(true);
                setProfile((prev) => (prev ? { ...prev, _count: { ...prev._count, followers: prev._count.followers + 1 } } : null));
            }
        } catch (err) {
            console.error("Failed to toggle follow:", err);
        } finally {
            setTogglingFollow(false);
        }
    };

    const handleLike = async (id: string) => {
        if (!sessionUserId) return;
        const hasLiked = posts.some((p) => p.id === id && p.likedByUser);

        // optimistic update: count-only
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const nextCount = hasLiked ? Math.max(0, (p.likesCount || 0) - 1) : (p.likesCount || 0) + 1;
                return { ...p, likesCount: nextCount, likedByUser: !hasLiked } as any;
            }),
        );

        try {
            const res = await axios.post("/api/komunitas/like", { postId: id });
            if (res.data && typeof res.data.likesCount === "number") {
                setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likesCount: res.data.likesCount, likedByUser: !!res.data.liked } : p)));
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
            // rollback
            setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likedByUser: hasLiked, likesCount: hasLiked ? (p.likesCount || 0) + 1 : Math.max(0, (p.likesCount || 1) - 1) } : p)));
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat profil...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <UserIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h2 className="mb-2 text-xl font-semibold">Profil tidak ditemukan</h2>
                    <p className="text-gray-600 dark:text-gray-400">Pengguna yang Anda cari tidak ada.</p>
                    <Button onClick={() => router.back()} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Profil</h1>
            </div>

            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile.image || ""} alt={profile.name || ""} />
                            <AvatarFallback className="text-2xl">{profile.name?.[0] || ""}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-400">@{profile.id.slice(-8)}</p>
                                </div>

                                {!isOwnProfile && session && (
                                    <Button onClick={handleFollow} disabled={togglingFollow} variant={following ? "outline" : "default"} className="min-w-[100px]">
                                        {togglingFollow ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : following ? (
                                            <>
                                                <UserMinus className="mr-2 h-4 w-4" />
                                                Unfollow
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Follow
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            <div className="mt-4 flex justify-center gap-6 sm:justify-start">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{profile._count.Post}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{profile._count.followers}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{profile._count.following}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600 sm:justify-start dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Bergabung{" "}
                                    {new Date(profile.createdAt).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                    })}
                                </div>
                                <Badge variant={profile.role === "admin" ? "destructive" : "secondary"}>{profile.role}</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Postingan</h3>

                {posts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium">Belum ada postingan</h3>
                            <p className="text-gray-600 dark:text-gray-400">{isOwnProfile ? "Anda belum membuat postingan apapun." : "Pengguna ini belum membuat postingan apapun."}</p>
                        </CardContent>
                    </Card>
                ) : (
                    posts.map((post) => <PostItem key={post.id} post={post} onLike={handleLike} onCommentClick={() => {}} onDelete={() => {}} togglingLikes={{}} session={session} />)
                )}
            </div>
        </div>
    );
}
