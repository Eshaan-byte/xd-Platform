import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-gray-800 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="space-y-2">
        <Link
          to="/dashboard/games"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive('/dashboard/games')
              ? 'bg-blue-600'
              : 'hover:bg-gray-700'
          }`}
        >
          Games
        </Link>

        <Link
          to="/dashboard/upload"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive('/dashboard/upload')
              ? 'bg-blue-600'
              : 'hover:bg-gray-700'
          }`}
        >
          Upload Game
        </Link>
      </nav>

      <div className="mt-auto pt-8">
        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
