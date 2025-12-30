"use client";

import ReduxProvider from '../redux/store/redux-provider';
import StudyMode from './study-mode/page';

export default function Home() {
  return (
    <ReduxProvider>
      <main>
        <StudyMode />
      </main>
    </ReduxProvider>
  );
}