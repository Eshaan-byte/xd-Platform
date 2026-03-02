import { notFound } from 'next/navigation';
import GameDetail from '@/components/games/GameDetail';

async function getGame(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    return null;
  }
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const game = await getGame(params.id);

  if (!game) {
    notFound();
  }

  return <GameDetail game={game} />;
}
