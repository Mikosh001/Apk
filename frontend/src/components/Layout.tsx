import { ReactNode } from 'react';

import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { ToastProvider } from './Toast';

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar />
        <main className="app-main" role="main">
          {children}
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
};
