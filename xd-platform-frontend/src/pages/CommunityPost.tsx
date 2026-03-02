import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCommunityPostBySlugApi } from "../services/api";

const Stat: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <span className="inline-flex items-center gap-2 text-[11px] text-gray-300">
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a]">{icon}</span>
    {children}
  </span>
);

const CommunityPost: React.FC = () => {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunityPostBySlugApi(slug)
      .then((data) => setPost(data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-gray-300">
        <h1 className="mb-2 text-2xl font-semibold">Post not found</h1>
        <Link to="/community" className="text-lime-400 hover:underline">Back to Community</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left sidebar */}
        <aside className="hidden md:block">
          <Link to="/community" className="mb-4 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            ← Back to Community
          </Link>
          {post.thumb && (
            <div className="mt-4 overflow-hidden rounded-md bg-[#111] ring-1 ring-white/5">
              <img src={post.thumb} alt={post.title} className="h-auto w-full object-cover" />
            </div>
          )}
        </aside>

        {/* Main content */}
        <main>
          {/* Author + date */}
          <div className="mb-3 flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className="uppercase text-gray-500">by</span>
              <span className="font-medium text-gray-200">{post.author}</span>
              <span className="ml-2 rounded-[3px] bg-lime-400 px-1.5 py-[1px] text-[9px] font-bold text-black">XD</span>
            </div>
            <span>{post.date}</span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-2xl font-semibold leading-tight md:text-[28px]">
            {post.title}
          </h1>

          {/* Hero image */}
          <div className="overflow-hidden rounded-lg bg-[#101010] ring-1 ring-white/5">
            <img src={post.image} alt={post.title} className="w-full object-cover" />
          </div>

          {/* Body */}
          <div className="prose prose-invert max-w-none prose-p:text-gray-300">
            {post.content.map((p, idx) => (
              <p key={idx} className="mt-5 text-sm leading-6">{p}</p>
            ))}
          </div>

          {/* Composer (read-only UI) */}
          <div className="mt-6 overflow-hidden rounded-xl bg-[#111] ring-1 ring-white/5">
            <div className="p-4">
              <textarea
                rows={3}
                placeholder="What’s on your mind ?"
                className="w-full resize-none rounded-md border border-white/10 bg-[#121212] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <button className="hover:text-white">📎 Attach</button>
                <div className="flex items-center gap-4">
                  <Stat icon="💬">{post.comments}</Stat>
                  <Stat icon="❤️">{post.likes}</Stat>
                  <button className="rounded-md bg-[#1f1f1f] px-3 py-1.5 text-gray-200 ring-1 ring-white/10 hover:bg-[#262626]">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* More from the community */}
          {post.more && post.more.length > 0 && (
            <section className="mt-10">
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                More from the community
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {post.more.map((m) => (
                  <Link to={`/community/${m.slug}`} key={m.slug} className="group">
                    <article className="overflow-hidden rounded-xl bg-[#141414] ring-1 ring-white/5 transition group-hover:ring-white/20">
                      <div className="p-4 sm:p-5">
                        <h3 className="mb-3 text-xl font-semibold leading-snug">{m.title}</h3>
                        <div className="overflow-hidden rounded-lg bg-[#101010] ring-1 ring-white/5">
                          <img src={m.image} alt={m.title} className="h-40 w-full object-cover" />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <Stat icon="💬">{m.comments}</Stat>
                            <Stat icon="❤️">{m.likes}</Stat>
                          </div>
                          <span className="text-[11px] text-gray-400">{m.date}</span>
                        </div>
                        <div className="mt-2 text-[11px] text-gray-400">
                          by <span className="text-gray-200">{m.author}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default CommunityPost;
