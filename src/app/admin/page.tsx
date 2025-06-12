// app/admin/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TokenService from '@/services/auth/tokenService';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!TokenService.isLoggedIn()) {
      router.push('/login');
    }
  }, []);

  return <h1>Bienvenido al Dashboard</h1>;
}
