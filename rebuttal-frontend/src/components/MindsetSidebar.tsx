interface MindsetSidebarProps {
  score: number;
  reasoning: string;
  isDealWon: boolean | null;
}

export function MindsetSidebar({ score, reasoning, isDealWon }: MindsetSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-panel">
        <h2>Buy Readiness</h2>
        <div className="score-display">
          <span className="score-number">{score}</span>
          <span className="score-max">/ 100</span>
        </div>
        <div className="score-bar-bg">
          <div 
            className="score-bar-fill" 
            style={{ width: `${Math.max(0, Math.min(100, score))}%` }} 
          />
        </div>
        
        {isDealWon === true && <div className="status-badge won">Deal Won!</div>}
        {isDealWon === false && <div className="status-badge lost">Deal Lost</div>}
        {isDealWon === null && <div className="status-badge active">In Progress</div>}
      </div>

      <div className="sidebar-panel" style={{ flex: 1 }}>
        <h2>Internal Mindset</h2>
        <div className="reasoning-text">
          {reasoning}
        </div>
      </div>
    </aside>
  );
}
