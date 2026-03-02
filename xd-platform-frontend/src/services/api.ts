const API_BASE = '/api/v1';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('xd_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// Auth
export async function loginApi(email: string, password: string) {
  const data = await request<{
    success: boolean;
    data: {
      token: string;
      user: { id: string; email: string; username: string; role: string };
    };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data.data;
}

export async function registerApi(email: string, password: string, username: string) {
  const data = await request<{
    success: boolean;
    data: {
      token: string;
      user: { id: string; email: string; username: string; role: string };
    };
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
  return data.data;
}

export async function getProfileApi() {
  const data = await request<{
    success: boolean;
    data: { id: string; email: string; username: string; role: string };
  }>('/auth/profile');
  return data.data;
}

// Games
export async function getGamesApi(params?: { page?: number; limit?: number; search?: string; tag?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.search) searchParams.set('search', params.search);
  if (params?.tag) searchParams.set('tag', params.tag);

  const qs = searchParams.toString();
  const data = await request<{
    success: boolean;
    data: any[];
    meta: { pagination: { page: number; limit: number; total: number; totalPages: number } };
  }>(`/games${qs ? `?${qs}` : ''}`);
  return data;
}

export async function getGameBySlugApi(slug: string) {
  const data = await request<{ success: boolean; data: any }>(`/games/slug/${slug}`);
  return data.data;
}

// Community
export async function getCommunityPostsApi() {
  const data = await request<{ success: boolean; data: any[] }>('/community');
  return data.data;
}

export async function getCommunityPostBySlugApi(slug: string) {
  const data = await request<{ success: boolean; data: any }>(`/community/${slug}`);
  return data.data;
}
