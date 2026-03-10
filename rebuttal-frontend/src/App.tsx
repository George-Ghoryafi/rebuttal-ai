import { useState } from 'react';
import './index.css';
import { LandingPage } from './components/LandingPage';
import { ChatPage } from './components/ChatPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'chat'>('landing');

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage onStart={() => setCurrentPage('chat')} />
      ) : (
        <ChatPage />
      )}
    </>
  );
}

export default App;
