"use client";

import { ReactNode, useState, useEffect } from "react";
import { Hash, TrendingUp, Users, MessageSquare, Calendar, Heart, MessageCircle, Clock, User, UserPlus, UserMinus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import FooterSection from "@/components/footer";
import NavbarArunika from "@/components/navbar";
import { authClient } from "@/lib/auth-client";

interface KomunitasLayoutProps {
    children: ReactNode;
}

interface TrendingPost {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        image: string;
    };
    likesCount: number;
    commentsCount: number;
    score: number;
    createdAt: string;
}

export default function KomunitasLayout({ children }: KomunitasLayoutProps) {
    const [popularTags, setPopularTags] = useState<{ name: string; count: number }[]>([]);
    const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalUsers: 0,
        totalComments: 0,
        activeToday: 0,
    });
    const [userProfile, setUserProfile] = useState<{
        id: string;
        name: string;
        image: string;
        _count: { followers: number; following: number; Post: number };
    } | null>(null);
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleTagClick = (tagName: string) => {
        router.push(`/id/komunitas?search=${encodeURIComponent(tagName)}`);
    };

    const handlePostClick = (postId: string) => {
        router.push(`/id/komunitas#post-${postId}`);
    };

    useEffect(() => {
        const fetchCommonData = async () => {
            try {
                // Fetch popular tags
                const tagsRes = await axios.get("/api/tags/popular");
                setPopularTags(tagsRes.data.tags);

                // Fetch trending posts
                const trendingRes = await axios.get("/api/komunitas/trending");
                setTrendingPosts(trendingRes.data.posts);

                // Fetch real community stats
                const statsRes = await axios.get("/api/komunitas/stats");
                setStats(statsRes.data);
            } catch (err) {
                console.error("Failed to fetch common data:", err);
                // Fallback to default values if API fails
                setStats({
                    totalPosts: 0,
                    totalUsers: 0,
                    totalComments: 0,
                    activeToday: 0,
                });
            }
        };
        fetchCommonData();
    }, []);

    useEffect(() => {
        const userId = (session?.user as any)?.id;
        if (!userId) {
            setUserProfile(null);
            return;
        }
        const fetchUserProfile = async () => {
            try {
                const profileRes = await axios.get(`/api/komunitas/profile/${userId}`);
                setUserProfile(profileRes.data.user);
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
                setUserProfile(null);
            }
        };
        fetchUserProfile();
    }, [(session?.user as any)?.id]);

    return (
        <>
            <NavbarArunika />
            <div className="bg-background text-foreground dark:bg-foreground dark:text-background min-h-screen pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        {/* Konten Utama */}
                        <div className="lg:col-span-3">{children}</div>

                        {/* Sidebar */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* User Profile */}
                            {userProfile && (
                                <Card className="dark:border-gray-700 dark:bg-gray-800">
                                    <CardHeader>
                                        <CardTitle className="text-font-primary dark:text-background flex items-center text-lg">
                                            <User className="mr-2 h-5 w-5" />
                                            Profil Anda
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4 flex items-center space-x-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={userProfile.image} alt={userProfile.name} />
                                                <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-font-primary dark:text-background truncate font-medium">{userProfile.name}</p>
                                                <p className="text-font-secondary text-sm dark:text-gray-400">@{userProfile.id.slice(-8)}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4 grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{userProfile._count.Post}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-600 dark:text-green-400">{userProfile._count.followers}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Followers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{userProfile._count.following}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Following</div>
                                            </div>
                                        </div>

                                        <Button variant="outline" size="sm" className="w-full" onClick={() => router.push(`/id/komunitas/profile/${userProfile.id}`)}>
                                            Lihat Profil
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Statistik Komunitas */}
                            <Card className="dark:border-gray-700 dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-font-primary dark:text-background flex items-center text-lg">
                                        <TrendingUp className="mr-2 h-5 w-5" />
                                        Statistik Komunitas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-font-secondary flex items-center text-sm dark:text-gray-300">
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Total Post
                                        </div>
                                        <Badge variant="secondary">{stats.totalPosts.toLocaleString()}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-font-secondary flex items-center text-sm dark:text-gray-300">
                                            <Users className="mr-2 h-4 w-4" />
                                            Anggota
                                        </div>
                                        <Badge variant="secondary">{stats.totalUsers.toLocaleString()}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-font-secondary flex items-center text-sm dark:text-gray-300">
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Komentar
                                        </div>
                                        <Badge variant="secondary">{stats.totalComments.toLocaleString()}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-font-secondary flex items-center text-sm dark:text-gray-300">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Aktif Hari Ini
                                        </div>
                                        <Badge variant="secondary">{stats.activeToday}</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trending Posts */}
                            <Card className="dark:border-gray-700 dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-font-primary dark:text-background flex items-center text-lg">
                                        <TrendingUp className="mr-2 h-5 w-5" />
                                        Trending Posts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {trendingPosts.length > 0 ? (
                                            trendingPosts.map((post) => (
                                                <div key={post.id} className="cursor-pointer rounded-lg border p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700" onClick={() => handlePostClick(post.id)}>
                                                    <div className="flex items-start space-x-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={post.author.image} alt={post.author.name} />
                                                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-font-primary dark:text-background text-sm font-medium">{post.author.name}</p>
                                                            <p className="text-font-secondary line-clamp-2 text-sm dark:text-gray-300">{post.content}</p>
                                                            <div className="text-font-secondary mt-2 flex items-center space-x-4 text-xs dark:text-gray-400">
                                                                <div className="flex items-center">
                                                                    <Heart className="mr-1 h-3 w-3" />
                                                                    {post.likesCount}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <MessageCircle className="mr-1 h-3 w-3" />
                                                                    {post.commentsCount}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Clock className="mr-1 h-3 w-3" />
                                                                    {new Date(post.createdAt).toLocaleDateString("id-ID")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-font-secondary text-center text-sm dark:text-gray-400">Memuat trending posts...</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tag Populer */}
                            <Card className="dark:border-gray-700 dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-font-primary dark:text-background flex items-center text-lg">
                                        <Hash className="mr-2 h-5 w-5" />
                                        Tag Populer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {popularTags.length > 0 ? (
                                            popularTags.slice(0, 10).map((tag) => (
                                                <div key={tag.name} className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleTagClick(tag.name)}>
                                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">#{tag.name}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {tag.count}
                                                    </Badge>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-font-secondary text-center text-sm dark:text-gray-400">Memuat tag...</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tips Komunitas */}
                            <Card className="dark:border-gray-700 dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-font-primary dark:text-background text-lg">💡 Tips Komunitas</CardTitle>
                                </CardHeader>
                                <CardContent className="text-font-secondary space-y-3 text-sm dark:text-gray-300">
                                    <div className="space-y-2">
                                        <p>• Gunakan tag yang relevan untuk postingan Anda</p>
                                        <p>• Bantu sesama anggota komunitas</p>
                                        <p>• Jaga keramahan dan saling menghormati</p>
                                        <p>• Laporkan konten yang tidak pantas</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <FooterSection />
        </>
    );
}
