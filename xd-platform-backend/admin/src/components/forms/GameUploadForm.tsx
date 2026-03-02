import { useState } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import { ApiResponse, UploadUrlResponse } from '@/lib/types';
import Button from '@/components/common/Button';

export default function GameUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameFile, setGameFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameFile || !thumbnail) {
      setError('Please select both game file and thumbnail');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      setProgress('Generating upload URLs...');

      const [gameUrlRes, thumbnailUrlRes] = await Promise.all([
        api.post<ApiResponse<UploadUrlResponse>>('/admin/upload-url', {
          fileName: gameFile.name,
          fileType: gameFile.type,
          fileSize: gameFile.size,
          uploadType: 'game',
        }),
        api.post<ApiResponse<UploadUrlResponse>>('/admin/upload-url', {
          fileName: thumbnail.name,
          fileType: thumbnail.type,
          fileSize: thumbnail.size,
          uploadType: 'thumbnail',
        }),
      ]);

      const gameUploadData = gameUrlRes.data.data!;
      const thumbnailUploadData = thumbnailUrlRes.data.data!;

      setProgress('Uploading game file...');
      await axios.put(gameUploadData.uploadUrl, gameFile, {
        headers: { 'Content-Type': gameFile.type },
      });

      setProgress('Uploading thumbnail...');
      await axios.put(thumbnailUploadData.uploadUrl, thumbnail, {
        headers: { 'Content-Type': thumbnail.type },
      });

      setProgress('Creating game entry...');
      await api.post('/admin/games', {
        title,
        description,
        thumbnailKey: thumbnailUploadData.key,
        thumbnailUrl: thumbnailUploadData.publicUrl,
        gameFileKey: gameUploadData.key,
        gameFileUrl: gameUploadData.publicUrl,
        gameFileSize: gameFile.size,
      });

      setProgress('');
      setTitle('');
      setDescription('');
      setGameFile(null);
      setThumbnail(null);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
      setProgress('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {progress && (
        <div className="p-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg">
          {progress}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Game Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          maxLength={100}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter game title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter game description"
        />
      </div>

      <div>
        <label htmlFor="gameFile" className="block text-sm font-medium mb-2">
          Game File (ZIP, RAR, or EXE)
        </label>
        <input
          id="gameFile"
          type="file"
          accept=".zip,.rar,.exe"
          onChange={(e) => setGameFile(e.target.files?.[0] || null)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
        />
        {gameFile && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Selected: {gameFile.name} ({(gameFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
      </div>

      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">
          Thumbnail Image (JPG, PNG, or WEBP)
        </label>
        <input
          id="thumbnail"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
        />
        {thumbnail && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Selected: {thumbnail.name}
          </p>
        )}
      </div>

      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? progress || 'Uploading...' : 'Upload Game'}
      </Button>
    </form>
  );
}
