import React from "react";

type Game = {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  tag?: string;
};

const featuredGame = {
  title: "Fortnite",
  price: "$120.99",
  originalPrice: "$223.99",
  image: "/images/fortnite-hero.jpg", // put under public/images/...
  thumbnail: "/images/fortnite-thumb.jpg",
};

const trendingGames: Game[] = [
  {
    id: 1,
    title: "Fortnite",
    price: "$120.99",
    image: "/images/games/fortnite.jpg",
    tag: "XD",
  },
  {
    id: 2,
    title: "Red Dead Redemption II",
    price: "$89.75",
    image: "/images/games/rdr2.jpg",
    tag: "XD",
  },
  {
    id: 3,
    title: "Alan Wake II",
    price: "$145.50",
    image: "/images/games/alanwake2.jpg",
    tag: "XD",
  },
  {
    id: 4,
    title: "Farming Simulator 25",
    price: "$67.30",
    image: "/images/games/farming-sim.jpg",
    tag: "XD",
  },
];

const xdgssSpecials: Game[] = [
  {
    id: 5,
    title: "NFS Unbound",
    price: "$120.99",
    image: "/images/games/nfs-unbound.jpg",
    tag: "XD",
  },
  {
    id: 6,
    title: "Resident Evil 3",
    price: "$89.75",
    image: "/images/games/re3.jpg",
    tag: "XD",
  },
  {
    id: 7,
    title: "Bloodlines 2",
    price: "$145.50",
    image: "/images/games/bloodlines2.jpg",
    tag: "XD",
  },
  {
    id: 8,
    title: "Chivalry 2",
    price: "$67.30",
    image: "/images/games/chivalry2.jpg",
    tag: "XD",
  },
];

const gamesOnSale: Game[] = [
  {
    id: 9,
    title: "Deus Ex: Human Revolution",
    price: "$120.99",
    image: "/images/games/deus-ex.jpg",
    tag: "XD",
  },
  {
    id: 10,
    title: "GTA V",
    price: "$145.50",
    image: "/images/games/gta-v.jpg",
    tag: "XD",
  },
  {
    id: 11,
    title: "Rocket League",
    price: "$145.50",
    image: "/images/games/rocket-league.jpg",
    tag: "XD",
  },
  {
    id: 12,
    title: "Rumbleverse",
    price: "$67.30",
    image: "/images/games/rumbleverse.jpg",
    tag: "XD",
  },
];

const communityPicks: Game[] = [
  {
    id: 13,
    title: "Rocket League",
    price: "",
    image: "/images/community/rocket-league-large.jpg",
  },
  {
    id: 14,
    title: "Tomb Raider",
    price: "",
    image: "/images/community/tomb-raider-large.jpg",
  },
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <main className="mx-auto max-w-6xl space-y-10 px-4 pb-20 pt-6">
        {/* FEATURED */}
        <SectionHeader title="Featured" />
        <FeaturedHero />

        {/* TRENDING GAMES */}
        <SectionHeader title="Trending Games" />
        <GameGrid games={trendingGames} />

        {/* XDGSS SPECIALS (with arrows in header + carousel arrows) */}
        <SectionHeader title="XDGSS Specials" showControls />
        <GameGrid games={xdgssSpecials} showArrows />

        {/* GAMES ON SALE */}
        <SectionHeader title="Games on Sale" />
        <GameGrid games={gamesOnSale} />

        {/* COMMUNITY PICKS */}
        <SectionHeader title="Community Picks" />
        <CommunityGrid games={communityPicks} />

        {/* PROMO BANNER */}
        <PromoBanner />
      </main>

      <Footer />
    </div>
  );
};

export default App;

/* ───────────────────────────────── HEADER ───────────────────────────────── */

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-white/5 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: logo + search */}
        <div className="flex items-center gap-6">
          <div className="text-2xl font-black tracking-tight">
            <img src="/images/logo.svg" alt="XD Platform Logo" />
          </div>
          <div className="relative">
            <input
              className="w-64 rounded-full bg-[#171717] py-2 pl-9 pr-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Search"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              🔍
            </span>
          </div>
        </div>

        {/* Center nav */}
        <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
          <button className="hover:text-white">Categories</button>
          <button className="hover:text-white">Game Store</button>
          <button className="hover:text-white">Community</button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-200 hover:border-white/30">
            Login
          </button>
          <button className="rounded-full bg-lime-400 px-4 py-1.5 text-sm font-medium text-black hover:bg-lime-300">
            Download
          </button>
        </div>
      </div>
    </header>
  );
};

/* ───────────────────────────── FEATURED HERO ───────────────────────────── */

const FeaturedHero: React.FC = () => {
  return (
    <section className="relative grid gap-4 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
      {/* Left: big banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#111]">
        <img
          src={featuredGame.image}
          alt={featuredGame.title}
          className="h-[280px] w-full object-cover md:h-[360px]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Carousel dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {Array.from({ length: 7 }).map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 w-4 rounded-full ${
                idx === 2 ? "bg-lime-400" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Left/right arrows */}
        <button className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl">
          ❮
        </button>
        <button className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl">
          ❯
        </button>
      </div>

      {/* Right: game info card */}
      <div className="flex flex-col justify-end">
        <div className="overflow-hidden rounded-xl bg-[#111]">
          <div className="flex flex-col">
            <img
              src={featuredGame.thumbnail}
              alt={`${featuredGame.title} thumbnail`}
              className="h-32 w-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{featuredGame.title}</h3>
                <span className="rounded-sm bg-lime-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                  XD
                </span>
              </div>

              <div className="mt-auto flex items-baseline gap-2">
                <span className="text-xs text-gray-400 line-through">
                  {featuredGame.originalPrice}
                </span>
                <span className="text-xl font-semibold text-lime-400">
                  {featuredGame.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────── SECTION HEADER ──────────────────────────── */

const SectionHeader: React.FC<{ title: string; showControls?: boolean }> = ({
  title,
  showControls = false,
}) => (
  <div className="flex items-center justify-between">
    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
      {title}
    </h2>
    {showControls && (
      <div className="flex gap-2 text-gray-400">
        <button className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 hover:border-white/30">
          ❮
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 hover:border-white/30">
          ❯
        </button>
      </div>
    )}
  </div>
);

/* ───────────────────────────────── GAME GRID ───────────────────────────── */

const GameGrid: React.FC<{ games: Game[]; showArrows?: boolean }> = ({
  games,
  showArrows = false,
}) => (
  <div className="relative">
    {showArrows && (
      <>
        <button className="absolute -left-5 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-sm md:flex">
          ❮
        </button>
        <button className="absolute -right-5 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-sm md:flex">
          ❯
        </button>
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
  <article className="group flex flex-col overflow-hidden rounded-xl bg-[#111] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <div className="relative">
      <img
        src={game.image}
        alt={game.title}
        className="h-40 w-full object-cover"
      />
    </div>
    <div className="flex items-center justify-between px-3 py-2 text-sm">
      <span className="truncate pr-2 font-medium">{game.title}</span>
      {game.tag && (
        <span className="rounded-sm bg-lime-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
          {game.tag}
        </span>
      )}
    </div>
    <div className="flex items-center justify-between border-t border-white/5 px-3 py-2 text-sm">
      <div className="flex flex-col">
        {game.originalPrice && (
          <span className="text-xs text-gray-500 line-through">
            {game.originalPrice}
          </span>
        )}
        {game.price && <span className="font-semibold">{game.price}</span>}
      </div>
    </div>
  </article>
);

/* ───────────────────────────── COMMUNITY GRID ──────────────────────────── */

const CommunityGrid: React.FC<{ games: Game[] }> = ({ games }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {games.map((game) => (
      <article
        key={game.id}
        className="group overflow-hidden rounded-xl bg-[#111] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative">
          <img
            src={game.image}
            alt={game.title}
            className="h-56 w-full object-cover"
          />
          <span className="absolute left-4 top-4 rounded-sm bg-white px-2 py-1 text-[10px] font-semibold tracking-wide text-black">
            PRODUCT
          </span>
        </div>
        <div className="px-4 py-3 text-lg font-semibold">{game.title}</div>
      </article>
    ))}
  </div>
);

/* ─────────────────────────────── PROMO BANNER ──────────────────────────── */

const PromoBanner: React.FC = () => (
  <section className="overflow-hidden rounded-2xl bg-[#111]">
    <div className="relative flex flex-col md:flex-row">
      <div className="flex-1 space-y-4 p-8">
        <h2 className="max-w-md text-2xl font-semibold md:text-3xl">
          Experience gaming redefined by XDGSS
        </h2>
        <p className="max-w-xl text-sm text-gray-300">
          Achieve pinpoint precision and lightning-fast reactions with unrivaled
          camera smoothness. Enjoy maximum comfort for hours of dominant,
          fatigue-free gameplay.
        </p>
        <button className="mt-4 inline-flex items-center rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-300">
          Sign In
        </button>
      </div>

      <div className="relative flex-1">
        <img
          src="/images/promo/xdgss-banner.jpg"
          alt="XDGSS promo"
          className="h-64 w-full object-cover md:h-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-transparent md:bg-gradient-to-l" />
      </div>
    </div>
  </section>
);

/* ───────────────────────────────── FOOTER ──────────────────────────────── */

const Footer: React.FC = () => (
  <footer className="mt-8 border-t border-white/5 bg-black/95">
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-2xl font-black tracking-tight">
            <img src="/images/logo.svg" alt="XD Platform Logo" />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-8 text-xs text-gray-400">
          <div>
            <h4 className="mb-3 font-semibold text-gray-200">Company</h4>
            <ul className="space-y-1">
              <li>Community</li>
              <li>About</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-200">Legal</h4>
            <ul className="space-y-1">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-200">Community</h4>
            <ul className="space-y-1">
              <li>X</li>
              <li>LinkedIn</li>
              <li>Discord</li>
              <li>GitHub</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        © {new Date().getFullYear()} XD Platform. All rights reserved.
      </p>
    </div>
  </footer>
);
