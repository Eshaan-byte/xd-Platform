import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getGamesApi } from "../services/api";

type Game = {
  id: string;
  title: string;
  slug: string;
  price?: string;
  thumb: string;
  tags?: string[];
  rating?: number;
  publisher?: string;
};

const ALL_TAGS = [
  "action",
  "open-world",
  "adventure",
  "rpg",
  "racing",
  "horror",
  "multiplayer",
  "sports",
  "simulation",
  "battle-royale",
  "stealth",
  "fighting",
  "casual",
];

const Categories: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag") || "";
  const searchQuery = searchParams.get("search") || "";
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    getGamesApi({
      limit: 50,
      tag: activeTag || undefined,
      search: searchQuery || undefined,
    })
      .then((res) => {
        setGames(
          res.data.map((g: any) => ({
            id: g.id,
            title: g.title,
            slug: g.slug,
            price: g.price,
            thumb: g.thumb || g.cover,
            tags: g.tags,
            rating: g.rating,
            publisher: g.publisher,
          }))
        );
        setTotal(res.meta.pagination.total);
      })
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [activeTag, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="mt-1 text-sm text-gray-400">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : `Browse games by genre${activeTag ? ` — showing "${activeTag}"` : ""}`}{" "}
          ({total} games)
        </p>
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSearchParams({})}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            !activeTag
              ? "bg-lime-400 text-black"
              : "border border-white/10 text-gray-300 hover:border-white/30"
          }`}
        >
          All
        </button>
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchParams({ tag })}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
              activeTag === tag
                ? "bg-lime-400 text-black"
                : "border border-white/10 text-gray-300 hover:border-white/30"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Game grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading games...</div>
      ) : games.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No games found for this category.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {games.map((game) => (
            <Link key={game.id} to={`/games/${game.slug}`} className="group block">
              <article className="flex flex-col overflow-hidden rounded-xl bg-[#111] shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl">
                <img
                  src={game.thumb}
                  alt={game.title}
                  className="h-44 w-full object-cover"
                />
                <div className="space-y-1 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="truncate pr-2 text-sm font-medium">{game.title}</span>
                    <span className="rounded-sm bg-lime-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                      XD
                    </span>
                  </div>
                  {game.price && (
                    <p className="text-xs font-semibold text-lime-400">{game.price}</p>
                  )}
                  {game.tags && game.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {game.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] capitalize text-gray-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
