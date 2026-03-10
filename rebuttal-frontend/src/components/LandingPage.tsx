import { useState, useEffect, useRef } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const DEMO_SEQUENCE = [
  { type: 'sys', text: "You are pitching a C-Suite executive. Address ROI, integration, security, and adoption.", delay: 500 },
  { type: 'user', text: "Hi, I'd like to show you our platform. It cuts procurement costs by 32% for Fortune 500s.", delay: 2000 },
  { type: 'score', val: 35, reasoning: "Strong ROI claim. I need to know about integration.", delay: 3500 },
  { type: 'assistant', text: "That's an interesting claim. How does it integrate with our existing ERP?", delay: 4000 },
  { type: 'user', text: "We integrate via a single REST API. Average deployment takes 3 weeks with zero downtime.", delay: 6500 },
  { type: 'score', val: 55, reasoning: "Fast integration time. What about compliance?", delay: 8000 },
  { type: 'assistant', text: "Good to know. But is my enterprise data actually secure with you?", delay: 8500 },
  { type: 'user', text: "We are SOC 2 Type II certified and GDPR compliant. Your data never leaves your VPC.", delay: 11000 },
  { type: 'score', val: 95, reasoning: "Security is solid. Deal won.", delay: 12500 },
  { type: 'assistant', text: "Alright, that covers my main concerns. Let's schedule a pilot.", delay: 13000 },
  { type: 'won', delay: 13500 }
];

export function LandingPage({ onStart }: LandingPageProps) {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [demoScore, setDemoScore] = useState(15);
  const [demoWon, setDemoWon] = useState<boolean | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll demo chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timeouts: number[] = [];
    
    const runDemo = () => {
      // Reset state for loop
      setMessages([]);
      setDemoScore(15);
      setDemoWon(null);

      DEMO_SEQUENCE.forEach(step => {
        const to = window.setTimeout(() => {
          if (step.type === 'sys' || step.type === 'user' || step.type === 'assistant') {
            setMessages(prev => [...prev, { role: step.type, content: step.text as string }]);
          } else if (step.type === 'score') {
            setDemoScore(step.val as number);
          } else if (step.type === 'won') {
            setDemoWon(true);
          }
        }, step.delay);
        timeouts.push(to as unknown as number);
      });

      // Loop entire sequence every 18 seconds
      const loop = window.setTimeout(runDemo, 18000);
      timeouts.push(loop as unknown as number);
    };

    runDemo();

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-content">
        
        {/* Left Column: Product Info */}
        <div className="landing-info">
          <h1>Welcome to Rebuttal</h1>
          <p className="subtitle">The ultimate AI-powered sales practice tool.</p>
          
          <div className="product-intro">
            <h2>How It Works</h2>
            <p>
              Rebuttal puts you face-to-face with a ruthless AI C-Suite Executive. Your goal is to pitch your B2B product 
              and convince them to buy. 
            </p>
            <p>
              <strong>The endgame:</strong> We are currently building out a real-time, ultra-low latency <strong>voice call</strong> integration. 
              For now, practice your pitches using our text interface.
            </p>
            
            <div className="features-list">
              <div className="feature">
                <h3>🧠 Mindset Tracking</h3>
                <p>Watch the buyer's internal reasoning update in real-time as they evaluate your pitch.</p>
              </div>
              <div className="feature">
                <h3>🎯 Dynamic Scoring</h3>
                <p>Address ROI, security, and implementation to raise your score past 90. Drop below 0, and they'll hang up.</p>
              </div>
            </div>
          </div>

          <button className="start-button" onClick={onStart}>
            Start Practice Call (Chat Mode)
          </button>
        </div>

        {/* Right Column: Live Demo */}
        <div className="landing-demo">
          <div className="demo-window">
            
            {/* Fake Header */}
            <div className="demo-header">
              <div className="demo-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="demo-title">Live Simulation</span>
            </div>
            
            {/* Fake Chat */}
            <div className="demo-chat">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message demo-msg animate-pop-in ${msg.role === 'sys' ? 'assistant' : msg.role}`}>
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Fake Sidebar/Metrics */}
            <div className="demo-metrics">
              <div className="demo-score-header">
                <span className="demo-score-label">Buy Readiness ({demoScore}/100)</span>
                {demoWon === true && <span className="demo-badge won animate-pop-in">Deal Won!</span>}
              </div>
              <div className="score-bar-bg demo-bar">
                <div className="score-bar-fill" style={{ width: `${Math.max(0, Math.min(100, demoScore))}%` }} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
