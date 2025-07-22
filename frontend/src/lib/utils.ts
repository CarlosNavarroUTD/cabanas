// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AxiosError } from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define interface for error response data
interface ErrorResponseData {
  error?: string;
  message?: string;
  [key: string]: unknown;
}

// Define return type for better type safety
type ErrorResponse = {
  type: 'validation' | 'auth' | 'permission' | 'server' | 'network';
  message: string;
}

export const handleApiError = (error: AxiosError<ErrorResponseData>): ErrorResponse => {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: data.error || 'Invalid data provided'
        };
      case 401:
        return {
          type: 'auth',
          message: 'Please login to continue'
        };
      case 403:
        return {
          type: 'permission',
          message: 'You don\'t have permission to perform this action'
        };
      default:
        return {
          type: 'server',
          message: 'Something went wrong'
        };
    }
  }
  
  return {
    type: 'network',
    message: 'Network error occurred'
  };
};

export function toSnakeCase<T extends object>(obj: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`),
      value
    ])
  );
}
