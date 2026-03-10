import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageList } from './MessageList';
import { ChatForm } from './ChatForm';
import { MindsetSidebar } from './MindsetSidebar';

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [score, setScore] = useState(15);
  const [reasoning, setReasoning] = useState('Waiting for the sales rep to begin the pitch...');
  const [isDealWon, setIsDealWon] = useState<boolean | null>(null);
  
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onopen = () => {
      console.log('Connected to chat server');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Update UI state from buyer's internal reasoning
        if (data.buy_readiness_score !== undefined) {
          setScore(data.buy_readiness_score);
        }
        if (data.internal_reasoning) {
          setReasoning(data.internal_reasoning);
        }
        
        // Add spoken response to chat history
        if (data.spoken_response) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.spoken_response }]);
        }

        // Handle termination cases
        const receivedScore = data.buy_readiness_score;
        if (receivedScore !== undefined && receivedScore <= 0) {
          setIsDealWon(false);
          ws.current?.close();
        } else if (
          (receivedScore !== undefined && receivedScore >= 90) || 
          data.is_deal_won === true
        ) {
          setIsDealWon(true);
          ws.current?.close();
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from chat server');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleSend = (text: string) => {
    if (isDealWon !== null || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    // Add user msg to UI
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    
    // Send to backend
    ws.current.send(text);
  };

  const isGameOver = isDealWon !== null;

  return (
    <div className="app-container">
      {/* Main Chat Layout */}
      <main className="chat-section">
        <header className="chat-header">
          <h1>Rebuttal - Active Session</h1>
        </header>
        
        <MessageList messages={messages} />
        
        <ChatForm 
          onSend={handleSend} 
          isGameOver={isGameOver} 
        />
      </main>

      <MindsetSidebar 
        score={score}
        reasoning={reasoning}
        isDealWon={isDealWon}
      />
    </div>
  );
}
