'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GoogleCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback, setTokensAndUser } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const error = searchParams.get('error');
        if (error) {
          setStatus('error');
          setMessage('Error de autorización de Google');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        const success = searchParams.get('success');
        const accessToken = searchParams.get('access');
        const refreshToken = searchParams.get('refresh');
        const userParam = searchParams.get('user');

        if (success === 'true' && accessToken && refreshToken && userParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userParam));
            setTokensAndUser({ access: accessToken, refresh: refreshToken }, userData);
            setStatus('success');
            setMessage('¡Autenticación exitosa! Redirigiendo...');
            setTimeout(() => router.push('/app'), 2000);
            return;
          } catch {
            setStatus('error');
            setMessage('Error procesando los datos del usuario');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }
        }

        const code = searchParams.get('code');
        if (code) {
          await handleGoogleCallback(code);
          setStatus('success');
          setMessage('¡Autenticación exitosa! Redirigiendo...');
          setTimeout(() => router.push('/app'), 2000);
          return;
        }

        setStatus('error');
        setMessage('No se recibieron parámetros de autenticación válidos');
        setTimeout(() => router.push('/login'), 3000);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage('Error procesando la autenticación');
        }
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error procesando la autenticación');
        setStatus('error');
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, router, setTokensAndUser]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />;
      case 'success': return <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />;
      case 'error': return <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Procesando autenticación</h2>
          <p className="mt-2 text-sm text-gray-600">Por favor espera mientras procesamos tu autenticación con Google</p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="flex justify-center">{getStatusIcon()}</div>
            <div className="text-center">
              <h3 className={`text-lg font-medium ${getStatusColor()}`}>
                {status === 'loading' && 'Procesando...'}
                {status === 'success' && '¡Éxito!'}
                {status === 'error' && 'Error'}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>

            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {message}
                  <br />
                  <span className="text-xs">Serás redirigido al login en unos segundos...</span>
                </AlertDescription>
              </Alert>
            )}

            {(status === 'error' || status === 'success') && (
              <div className="text-center">
                <button
                  onClick={() => router.push(status === 'success' ? '/app' : '/login')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {status === 'success' ? 'Ir a la aplicación' : 'Volver al login'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
