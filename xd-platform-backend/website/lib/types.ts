export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  gameFile: {
    s3Key: string;
    s3Url: string;
    size: number;
    uploadDate: string;
  };
  isActive: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  downloadedGames: Array<{
    gameId: string;
    downloadDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  meta?: {
    timestamp: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
