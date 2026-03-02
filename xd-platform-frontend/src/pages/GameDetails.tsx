import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGameBySlugApi, getGamesApi } from "../services/api";

const GameDetails: React.FC = () => {
  const { slug = "" } = useParams();
  const [game, setGame] = useState<any>(null);
  const [moreLikeThis, setMoreLikeThis] = useState<any[]>([]);
  const [active, setActive] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getGameBySlugApi(slug)
      .then((data) => {
        setGame(data);
        setActive(data.gallery?.[0] ?? data.cover);
        // fetch "more like this" by first tag
        const tag = data.tags?.[0];
        if (tag) {
          getGamesApi({ tag, limit: 5 }).then((res) => {
            setMoreLikeThis(res.data.filter((g: any) => g.slug !== data.slug).slice(0, 4));
          });
        }
      })
      .catch(() => setGame(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-gray-300">
        <h1 className="mb-2 text-2xl font-semibold">Game not found</h1>
        <p className="mb-6 text-sm">We couldn't find a game at "{slug}".</p>
        <Link to="/" className="rounded-md bg-lime-400 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-300">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="mx-auto mt-4 max-w-6xl px-4 text-xs text-gray-400">
        <Link to="/" className="hover:text-white">All Games</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-300">{game.title}</span>
      </div>

      {/* Title */}
      <div className="mx-auto max-w-6xl px-4 pt-2">
        <h1 className="text-lg font-semibold tracking-wide">{game.title}</h1>
      </div>

      {/* Gallery + Info */}
      <section className="mx-auto mt-3 max-w-6xl grid gap-5 px-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg bg-[#111]">
            <img src={active} alt={game.title} className="h-[260px] w-full object-cover md:h-[340px]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          <div className="grid grid-cols-5 gap-3">
            {(game.gallery?.length ? game.gallery : [game.cover]).map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(src)}
                className={`overflow-hidden rounded-md bg-[#161616] ring-1 ring-white/5 hover:ring-white/20 ${
                  active === src ? "outline outline-2 outline-lime-400" : ""
                }`}
              >
                <img src={src} alt={`${game.title} ${i + 1}`} className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <aside className="flex flex-col gap-3 rounded-lg bg-[#111] p-4">
          <div className="flex items-start gap-3">
            <div className="h-16 w-24 overflow-hidden rounded bg-[#0d0d0d] ring-1 ring-white/5">
              <img src={game.thumb || game.cover} alt={game.title} className="h-full w-full object-cover" />
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {/* placeholder blurb; swap with real description later */}
              A signature mix of open-world freedom, cinematic missions, and unforgettable characters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
            <div>
              <div className="text-gray-400">RELEASE DATE</div>
              <div className="text-gray-200">{game.releaseDate ?? "TBA"}</div>
            </div>
            <div>
              <div className="text-gray-400">PUBLISHER</div>
              <div className="text-gray-200">{game.publisher ?? "—"}</div>
            </div>
            <div>
              <div className="text-gray-400">RATING</div>
              <div className="text-gray-200">{game.rating ? `★★★★★`.slice(0, game.rating) : "—"}</div>
            </div>
          </div>

          {game.platforms && (
            <div className="flex flex-wrap gap-2 pt-1">
              {game.platforms.map((p) => (
                <span key={p} className="rounded-sm bg-[#0f0f0f] px-2 py-1 text-[10px] tracking-wide text-gray-200 ring-1 ring-white/10">
                  {p}
                </span>
              ))}
            </div>
          )}

          <div className="mt-1 flex items-center justify-between">
            <div className="flex flex-col">
              {game.originalPrice && <span className="text-xs text-gray-400 line-through">{game.originalPrice}</span>}
              {game.price && <span className="text-lg font-semibold text-lime-400">{game.price}</span>}
            </div>
            <button className="rounded-md bg-lime-400 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-300">
              DOWNLOAD
            </button>
          </div>
        </aside>
      </section>

      {/* More like this */}
      <section className="mx-auto mt-8 max-w-6xl px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">More like this</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {moreLikeThis.map((g) => (
            <Link key={g.id} to={`/games/${g.slug}`} className="group block">
              <article className="overflow-hidden rounded-lg bg-[#111] ring-1 ring-white/5 transition group-hover:-translate-y-1 group-hover:ring-white/20">
                <img src={g.cover} alt={g.title} className="h-40 w-full object-cover" />
                <div className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="truncate pr-2">{g.title}</span>
                  {g.price && <span className="font-semibold">{g.price}</span>}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT THE GAME */}
    {game.description && (
    <section className="mx-auto mt-8 max-w-6xl space-y-3 px-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
        About the Game
        </h2>
        <p className="text-sm leading-6 text-gray-300">
        {game.description}
        </p>
    </section>
    )}

    {/* REVIEWS */}
    {game.reviews && game.reviews.length > 0 && (
    <section className="mx-auto mt-8 max-w-6xl px-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
        Reviews
        </h2>

        <div className="space-y-3">
        {game.reviews.map((r, i) => (
            <ReviewItem
            key={i}
            user={r.user}
            date={r.date}
            rating={r.rating}
            text={r.text}
            />
        ))}
        </div>

        <div className="mt-4 flex">
        <button className="mx-auto rounded-md border border-white/10 px-4 py-2 text-sm text-gray-200 hover:border-white/30">
            Load more reviews
        </button>
        </div>
    </section>
    )}
    </>
  );
};

const ReviewItem: React.FC<{
  user: string;
  date: string;
  rating: number;
  text: string;
}> = ({ user, date, rating, text }) => {
  return (
    <div className="rounded-lg bg-[#111] p-4 ring-1 ring-white/5">
      {/* User + Rating */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-200">{user}</div>
        <div className="text-yellow-400 text-sm">
          {"★".repeat(rating)}{" "}
          <span className="text-gray-500">
            {"★".repeat(5 - rating)}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="text-xs text-gray-500 mb-2">{date}</div>

      {/* Text */}
      <p className="text-sm text-gray-300 leading-6">{text}</p>
    </div>
  );
};


export default GameDetails;
