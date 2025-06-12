// app/admin/layout.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import TokenService from '@/services/auth/tokenService';
import AdminNav from '@/components/AdminNav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const isAdmin = TokenService.isAdmin();

  if (!isAdmin) {
    redirect('/login');
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}
