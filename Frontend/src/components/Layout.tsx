
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
