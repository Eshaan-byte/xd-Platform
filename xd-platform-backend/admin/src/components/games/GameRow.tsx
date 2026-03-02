import { useState } from 'react';
import { Game } from '@/lib/types';
import api from '@/lib/api';
import Button from '@/components/common/Button';

interface GameRowProps {
  game: Game;
  onUpdate: () => void;
}

export default function GameRow({ game, onUpdate }: GameRowProps) {
  const [loading, setLoading] = useState(false);

  const handleToggleActive = async () => {
    if (!confirm(`Are you sure you want to ${game.isActive ? 'deactivate' : 'activate'} this game?`)) {
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/games/${game.id}`, {
        isActive: !game.isActive,
      });
      onUpdate();
    } catch (error) {
      alert('Failed to update game');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/admin/games/${game.id}`);
      onUpdate();
    } catch (error) {
      alert('Failed to delete game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-3">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-16 h-16 object-cover rounded"
        />
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">{game.title}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
          {game.description}
        </div>
      </td>
      <td className="px-4 py-3">{game.downloads}</td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded text-sm ${
            game.isActive
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
          }`}
        >
          {game.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            variant={game.isActive ? 'secondary' : 'primary'}
            onClick={handleToggleActive}
            disabled={loading}
            className="text-sm"
          >
            {game.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
            className="text-sm"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
