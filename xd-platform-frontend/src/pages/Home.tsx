import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGamesApi } from "../services/api";

type Game = {
  id: string;
  title: string;
  slug: string;
  price: string;
  originalPrice?: string;
  cover: string;
  thumb: string;
  tag?: string;
};

const Home: React.FC = () => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGamesApi({ limit: 50 })
      .then((res) => {
        setAllGames(
          res.data.map((g: any) => ({
            id: g.id,
            title: g.title,
            slug: g.slug,
            price: g.price || "",
            originalPrice: g.originalPrice,
            cover: g.cover,
            thumb: g.thumb || g.cover,
            tag: "XD",
          }))
        );
      })
      .catch(() => setAllGames([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading...</div>;
  }

  // Split games into sections (use what the API returns)
  const featured = allGames[0];
  const trendingGames = allGames.slice(0, 4);
  const xdgssSpecials = allGames.slice(4, 8);
  const gamesOnSale = allGames.slice(8, 12);
  const communityPicks = allGames.slice(12, 14);

  return (
    <>
      {/* FEATURED */}
      <SectionHeader title="Featured" />
      {featured && <FeaturedHero game={featured} />}

      {/* TRENDING GAMES */}
      <SectionHeader title="Trending Games" />
      <GameGrid games={trendingGames} />

      {/* XDGSS SPECIALS */}
      <SectionHeader title="XDGSS Specials" showControls />
      <GameGrid games={xdgssSpecials} showArrows />

      {/* GAMES ON SALE */}
      <SectionHeader title="Games on Sale" />
      <GameGrid games={gamesOnSale} />

      {/* COMMUNITY PICKS */}
      {communityPicks.length > 0 && (
        <>
          <SectionHeader title="Community Picks" />
          <CommunityGrid games={communityPicks} />
        </>
      )}

      {/* PROMO BANNER */}
      <PromoBanner />
    </>
  );
};

export default Home;

/* ───────── Components below ───────── */

const FeaturedHero: React.FC<{ game: Game }> = ({ game }) => (
  <section className="relative grid gap-4 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
    <Link to={`/games/${game.slug}`} className="relative overflow-hidden rounded-xl bg-[#111]">
      <img src={game.cover} alt={game.title} className="h-[280px] w-full object-cover md:h-[360px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: 7 }).map((_, idx) => (
          <span key={idx} className={`h-1.5 w-4 rounded-full ${idx === 2 ? "bg-lime-400" : "bg-white/30"}`} />
        ))}
      </div>
      <button className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl">❮</button>
      <button className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl">❯</button>
    </Link>

    <div className="flex flex-col justify-end">
      <Link to={`/games/${game.slug}`} className="overflow-hidden rounded-xl bg-[#111]">
        <div className="flex flex-col">
          <img src={game.thumb} alt={`${game.title} thumbnail`} className="h-32 w-full object-cover" />
          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{game.title}</h3>
              <span className="rounded-sm bg-lime-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">XD</span>
            </div>
            <div className="mt-auto flex items-baseline gap-2">
              {game.originalPrice && (
                <span className="text-xs text-gray-400 line-through">{game.originalPrice}</span>
              )}
              <span className="text-xl font-semibold text-lime-400">{game.price}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  </section>
);

const SectionHeader: React.FC<{ title: string; showControls?: boolean }> = ({ title, showControls = false }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">{title}</h2>
    {showControls && (
      <div className="flex gap-2 text-gray-400">
        <button className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 hover:border-white/30">❮</button>
        <button className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 hover:border-white/30">❯</button>
      </div>
    )}
  </div>
);

const GameGrid: React.FC<{ games: Game[]; showArrows?: boolean }> = ({ games, showArrows = false }) => (
  <div className="relative">
    {showArrows && (
      <>
        <button className="absolute -left-5 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-sm md:flex">❮</button>
        <button className="absolute -right-5 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-sm md:flex">❯</button>
      </>
    )}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  </div>
);

const GameCard: React.FC<{ game: Game }> = ({ game }) => (
  <Link to={`/games/${game.slug}`} className="block group">
    <article className="flex flex-col overflow-hidden rounded-xl bg-[#111] shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl">
      <div className="relative">
        <img src={game.thumb} alt={game.title} className="h-40 w-full object-cover" />
      </div>
      <div className="flex items-center justify-between px-3 py-2 text-sm">
        <span className="truncate pr-2 font-medium">{game.title}</span>
        {game.tag && (
          <span className="rounded-sm bg-lime-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
            {game.tag}
          </span>
        )}
      </div>
    </article>
  </Link>
);

const CommunityGrid: React.FC<{ games: Game[] }> = ({ games }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {games.map((game) => (
      <Link key={game.id} to={`/games/${game.slug}`}>
        <article className="group overflow-hidden rounded-xl bg-[#111] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="relative">
            <img src={game.cover} alt={game.title} className="h-56 w-full object-cover" />
            <span className="absolute left-4 top-4 rounded-sm bg-white px-2 py-1 text-[10px] font-semibold tracking-wide text-black">PRODUCT</span>
          </div>
          <div className="px-4 py-3 text-lg font-semibold">{game.title}</div>
        </article>
      </Link>
    ))}
  </div>
);

const PromoBanner: React.FC = () => (
  <section className="overflow-hidden rounded-2xl bg-[#111]">
    <div className="relative flex flex-col md:flex-row">
      <div className="flex-1 space-y-4 p-8">
        <h2 className="max-w-md text-2xl font-semibold md:text-3xl">Experience gaming redefined by XDGSS</h2>
        <p className="max-w-xl text-sm text-gray-300">
          Achieve pinpoint precision and lightning-fast reactions with unrivaled camera smoothness. Enjoy maximum comfort for hours of dominant,
          fatigue-free gameplay.
        </p>
        <a href="/login" className="mt-4 inline-flex items-center rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-300">
          Sign In
        </a>
      </div>

      <div className="relative flex-1">
        <img src="/images/promo/xdgss-banner.jpg" alt="XDGSS promo" className="h-64 w-full object-cover md:h-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-transparent md:bg-gradient-to-l" />
      </div>
    </div>
  </section>
);
