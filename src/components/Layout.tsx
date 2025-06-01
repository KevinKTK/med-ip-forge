
import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-retro-gradient relative overflow-x-hidden">
      <Navigation />
      <main className="container mx-auto px-4 py-6 relative z-10">
        {children}
      </main>
    </div>
  );
};
