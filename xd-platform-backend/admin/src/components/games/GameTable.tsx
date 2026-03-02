import { Game } from '@/lib/types';
import GameRow from './GameRow';

interface GameTableProps {
  games: Game[];
  onUpdate: () => void;
}

export default function GameTable({ games, onUpdate }: GameTableProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No games found. Upload your first game!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="px-4 py-3 text-left">Thumbnail</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Downloads</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <GameRow key={game.id} game={game} onUpdate={onUpdate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
