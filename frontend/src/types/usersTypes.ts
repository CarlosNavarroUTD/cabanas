// src/types/userTypes.ts

/**
 * Interfaz para los datos de una persona
 */
export interface Person {
  id_persona: number;
  nombre: string;
  apellido: string;
}

/**
 * Interfaz para los datos completos de un usuario
 */
export interface User {
  rol: string;
  id: number;
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  phone?: string;
  persona?: Person;
  avatar?: string; 
}

/**
 * Credenciales para inicio de sesión
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos para registro de usuario
 */
export interface RegisterData {
  email: string;
  password: string;
  phone?: string;
}

/**
 * Respuesta de la API al iniciar sesión
 */
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User; 
}

/**
 * Respuesta de la API al registrar un usuario
 */
export interface RegisterResponse {
  success: boolean;
  message?: string;
  userId?: number;
}

/**
 * Detalles de error de la API
 */
export interface ApiErrorDetail {
  [key: string]: string | string[];
}

/**
 * Respuesta de error de la API
 */
export interface ApiErrorResponse {
  data?: ApiErrorDetail | string;
}

/**
 * Error de la API
 */
export interface ApiError {
  response?: ApiErrorResponse;
  message?: string;
  code?: string;
  status?: number;
}