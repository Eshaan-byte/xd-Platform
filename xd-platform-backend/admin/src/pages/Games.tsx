import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { Game, ApiResponse } from '@/lib/types';
import GameTable from '@/components/games/GameTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Game[]>>('/admin/games');

      if (response.data.success && response.data.data) {
        setGames(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Games</h1>
        <Link to="/dashboard/upload">
          <Button>Upload New Game</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <GameTable games={games} onUpdate={fetchGames} />
      </div>
    </div>
  );
}
