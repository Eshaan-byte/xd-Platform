'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Game } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/common/Button';

interface GameDetailProps {
  game: Game;
}

export default function GameDetail({ game }: GameDetailProps) {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      setDownloading(true);
      setError(null);

      const response = await api.get(`/games/${game.id}/download`);

      if (response.data.success && response.data.data.downloadUrl) {
        window.location.href = response.data.data.downloadUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download game');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
          <Image
            src={game.thumbnail}
            alt={game.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{game.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <strong>Size:</strong> {formatFileSize(game.gameFile.size)}
            </div>
            <div>
              <strong>Downloads:</strong> {game.downloads}
            </div>
            <div>
              <strong>Added:</strong> {formatDate(game.createdAt)}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {game.description}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto px-8 py-3 text-lg"
          >
            {downloading ? 'Generating Download Link...' : 'Download Game'}
          </Button>

          {!user && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              You need to be logged in to download games.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
