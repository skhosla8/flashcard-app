"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainHeader from '../components/main-header';
import Provider from '../redux/store/redux-provider';
import store from '../redux/store'; // Import your store
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let persistor = persistStore(store);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          <PersistGate loading={null} persistor={persistor}>
            <main className="w-5/6 md:w-4xl lg:w-5xl xl:w-3/4 h-max bg-[#F7F3F0] flex justify-self-center items-center flex-col">
              <MainHeader />
              {children}
            </main>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
