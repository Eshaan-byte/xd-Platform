import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCommunityPostsApi } from "../services/api";

/* ---------- Types ---------- */
type Post = {
  id: number;
  slug: string;
  title: string;
  image: string;
  comments: number;
  likes: number;
  author: string;
  date: string;
  featured?: boolean;
};

/* ---------- Small UI bits ---------- */
const Stat: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <span className="inline-flex items-center gap-2 text-[11px] text-gray-300">
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a]">
      {icon}
    </span>
    {children}
  </span>
);

const AuthorRow: React.FC<{ author: string; date: string }> = ({ author, date }) => (
  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
    <div className="flex items-center gap-2">
      <span className="uppercase text-gray-500">by</span>
      <span className="font-medium text-gray-200">{author}</span>
      <span className="ml-2 rounded-[3px] bg-lime-400 px-1.5 py-[1px] text-[9px] font-bold text-black">
        XD
      </span>
    </div>
    <span>{date}</span>
  </div>
);

/* ---------- Cards ---------- */
const FeaturedPost: React.FC<{ post: Post }> = ({ post }) => (
  <Link to={`/community/${post.slug}`} className="block group">
    <article className="overflow-hidden rounded-xl bg-[#141414] ring-1 ring-white/5 transition group-hover:ring-white/20">
      <div className="p-5 sm:p-6">
        <h2 className="mb-4 max-w-3xl text-2xl font-semibold leading-tight sm:text-[28px]">
          {post.title}
        </h2>

        <div className="overflow-hidden rounded-lg bg-[#101010] ring-1 ring-white/5">
          <img src={post.image} alt={post.title} className="h-auto w-full object-cover" />
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-6">
          <Stat icon="💬">{post.comments} Comments</Stat>
          <Stat icon="❤️">{post.likes} Likes</Stat>
        </div>

        <AuthorRow author={post.author} date={post.date} />
      </div>
    </article>
  </Link>
);

const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <Link to={`/community/${post.slug}`} className="block group">
    <article className="overflow-hidden rounded-xl bg-[#141414] ring-1 ring-white/5 transition group-hover:ring-white/20">
      <div className="p-4 sm:p-5">
        <h3 className="mb-3 text-lg font-semibold leading-snug">{post.title}</h3>

        <div className="overflow-hidden rounded-lg bg-[#101010] ring-1 ring-white/5">
          <img src={post.image} alt={post.title} className="h-36 w-full object-cover sm:h-40" />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Stat icon="💬">{post.comments}</Stat>
            <Stat icon="❤️">{post.likes}</Stat>
          </div>
          <div className="text-[10px] text-gray-500">FPS / 2L</div>
        </div>

        <AuthorRow author={post.author} date={post.date} />
      </div>
    </article>
  </Link>
);

/* ---------- Composer (UI only) ---------- */
const Composer: React.FC = () => (
  <div className="overflow-hidden rounded-xl bg-[#111] ring-1 ring-white/5">
    <div className="border-b border-white/5 px-4 py-3 text-sm font-semibold">Community</div>
    <div className="space-y-3 p-4">
      <input
        type="text"
        placeholder="Topic"
        className="w-full rounded-md border border-white/10 bg-[#121212] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
      />
      <textarea
        rows={3}
        placeholder="What’s on your mind?"
        className="w-full resize-none rounded-md border border-white/10 bg-[#121212] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
      />
      <div className="flex items-center justify-between">
        <button className="text-xs text-gray-300 hover:text-white">📎 Attach</button>
        <button className="rounded-md bg-[#1f1f1f] px-3 py-1.5 text-xs text-gray-200 ring-1 ring-white/10 hover:bg-[#262626]">
          Post
        </button>
      </div>
    </div>
  </div>
);

/* ---------- Page ---------- */
const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunityPostsApi()
      .then((data) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts.find((p) => p.featured);
  const others = posts.filter((p) => !p.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading community posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6">
        {/* Composer */}
        <Composer />

        {/* Featured */}
        {featured && (
          <div className="mt-6">
            <FeaturedPost post={featured} />
          </div>
        )}

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {others.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
