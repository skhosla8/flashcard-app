"use client";

import ReduxProvider from '../redux/store/redux-provider';
import { useEffect } from 'react';
import { redirect } from 'next/navigation'

export default function Home({ children }: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    redirect('/study-mode');

  }, []);

  return (
    <ReduxProvider>
      <main>
        {children}
      </main>
    </ReduxProvider>
  );
}