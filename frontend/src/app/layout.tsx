import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TeamProvider } from '@/contexts/TeamContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <TeamProvider>
          <div className="min-h-screen flex flex-col">
            {/* Solo mostrar Navbar y Footer en páginas públicas */}
            {/* El dashboard tendrá su propio layout */}
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </TeamProvider>
      </body>
    </html>
  );
}