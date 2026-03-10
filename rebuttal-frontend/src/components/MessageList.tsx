import { useEffect, useRef } from 'react';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom only when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.length === 0 && (
        <div className="message assistant">
          You are pitching a C-Suite executive. Make sure to address ROI, integration, security, and adoption. They aren't sold yet.
        </div>
      )}
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.role}`}>
          {msg.content}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
