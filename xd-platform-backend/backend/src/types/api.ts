export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponseMeta {
  timestamp: string;
  requestId?: string;
  pagination?: PaginationMeta;
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
  meta?: ApiResponseMeta;
}

export class ApiResponseHelper {
  private static createMeta(): ApiResponseMeta {
    return {
      timestamp: new Date().toISOString(),
    };
  }

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta: this.createMeta(),
    };
  }

  static error(
    message: string,
    error?: string,
    errors?: Array<{ field: string; message: string }>
  ): ApiResponse {
    return {
      success: false,
      message,
      error,
      errors,
      meta: this.createMeta(),
    };
  }

  static paginated<T>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    message: string = 'Success'
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return {
      success: true,
      message,
      data,
      meta: {
        ...this.createMeta(),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      },
    };
  }
}
