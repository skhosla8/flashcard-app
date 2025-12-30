"use client";

import ReduxProvider from '../redux/store/redux-provider';
import StudyMode from './study-mode/page';

export default function Home() {
  return (
    <ReduxProvider>
      <main className='w-screen h-screen bg-blue-500'>
        <StudyMode />
      </main>
    </ReduxProvider>
  );
}