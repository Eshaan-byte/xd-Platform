'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Game, ApiResponse } from '@/lib/types';
import GameGrid from '@/components/games/GameGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchGames();
  }, [page]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Game[]>>('/games', {
        params: { page, limit: 12 },
      });

      if (response.data.success && response.data.data) {
        setGames((prev) => (page === 1 ? response.data.data! : [...prev, ...response.data.data!]));
        setHasMore(response.data.meta?.pagination?.hasNext || false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Browse Games</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and download amazing games for free
        </p>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No games available yet</p>
        </div>
      ) : (
        <>
          <GameGrid games={games} />

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
