// src/components/layout/Layout.tsx
import type { ReactNode } from 'react';
import ToastContainer from '../common/ToastContainer';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  // Layout for auth pages (login, register)
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(
    path => window.location.pathname.startsWith(path)
  );

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-2">
        <main className="max-w-4xl mx-auto">{children}</main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {user && <Sidebar />}
        <main className="flex-1">
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Layout;