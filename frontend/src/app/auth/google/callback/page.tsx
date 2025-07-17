'use client';

import { Suspense } from 'react';
import GoogleCallbackContent from './GoogleCallbackContent';

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Cargando...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
