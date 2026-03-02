'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { User, Game } from '@/lib/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ProfilePage() {
  const router = useRouter();
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [downloadedGames, setDownloadedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
      return;
    }

    if (firebaseUser) {
      fetchProfile();
    }
  }, [firebaseUser, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data.success && response.data.data) {
        setUserData(response.data.data);

        if (response.data.data.downloadedGames?.length > 0) {
          const gamePromises = response.data.data.downloadedGames.map(
            async (download: any) => {
              try {
                const gameRes = await api.get(`/games/${download.gameId}`);
                return gameRes.data.success ? gameRes.data.data : null;
              } catch {
                return null;
              }
            }
          );

          const games = await Promise.all(gamePromises);
          setDownloadedGames(games.filter(Boolean));
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!userData) {
    return <div>Failed to load profile</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Username</label>
            <p className="text-lg font-medium">{userData.username}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
            <p className="text-lg font-medium">{userData.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Role</label>
            <p className="text-lg font-medium capitalize">{userData.role}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Member Since</label>
            <p className="text-lg font-medium">{formatDate(userData.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Download History</h2>

        {downloadedGames.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            You haven&apos;t downloaded any games yet.
          </p>
        ) : (
          <div className="space-y-4">
            {downloadedGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="block p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-semibold text-lg">{game.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {game.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
