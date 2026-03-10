import { useState } from 'react';

interface ChatFormProps {
  onSend: (message: string) => void;
  isGameOver: boolean;
}

export function ChatForm({ onSend, isGameOver }: ChatFormProps) {
  // Local state for the input field to prevent re-rendering the whole ChatPage on every keystroke
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGameOver) return;
    
    onSend(inputValue);
    setInputValue('');
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        className="input-field"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={isGameOver ? "Meeting ended." : "Type your pitch here..."}
        disabled={isGameOver}
        autoFocus
      />
      <button type="submit" className="send-button" disabled={isGameOver || !inputValue.trim()}>
        Send
      </button>
    </form>
  );
}
