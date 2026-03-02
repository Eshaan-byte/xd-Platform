import { useNavigate } from 'react-router-dom';
import GameUploadForm from '@/components/forms/GameUploadForm';

export default function Upload() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard/games');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Upload New Game</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <GameUploadForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
