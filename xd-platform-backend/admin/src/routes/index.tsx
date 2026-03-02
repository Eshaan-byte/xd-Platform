import { createBrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import Upload from '@/pages/Upload';
import Games from '@/pages/Games';
import AdminLayout from '@/components/layout/AdminLayout';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'upload',
        element: <Upload />,
      },
      {
        path: 'games',
        element: <Games />,
      },
    ],
  },
]);
