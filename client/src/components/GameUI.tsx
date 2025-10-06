interface GameUIProps {
  score: number;
  highScore: number;
  gameState: string;
  onStart: () => void;
  onRestart: () => void;
  onPause: () => void;
  onResume: () => void;
}

const GameUI = ({ 
  score, 
  highScore, 
  gameState, 
  onStart, 
  onRestart, 
  onPause, 
  onResume 
}: GameUIProps) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      minWidth: '400px'
    }}>
      {/* Title */}
      <h1 style={{
        color: '#ffffff',
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '0',
        textAlign: 'center'
      }}>
        🐍 SNAKE GAME
      </h1>

      {/* Score Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#2a2a2a',
        padding: '10px 20px',
        borderRadius: '8px',
        border: '1px solid #444'
      }}>
        <div style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Score: <span style={{ color: '#44ff44' }}>{score}</span>
        </div>
        
        <div style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          High Score: <span style={{ color: '#ffff44' }}>{highScore}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {gameState === 'ready' && (
          <button
            onClick={onStart}
            style={{
              backgroundColor: '#44ff44',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#66ff66';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#44ff44';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ▶️ START GAME
          </button>
        )}

        {gameState === 'playing' && (
          <button
            onClick={onPause}
            style={{
              backgroundColor: '#ffaa00',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#ffcc33';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ffaa00';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ⏸️ PAUSE
          </button>
        )}

        {gameState === 'paused' && (
          <button
            onClick={onResume}
            style={{
              backgroundColor: '#44ff44',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#66ff66';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#44ff44';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ▶️ RESUME
          </button>
        )}

        {gameState === 'gameOver' && (
          <button
            onClick={onRestart}
            style={{
              backgroundColor: '#ff4444',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#ff6666';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ff4444';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🔄 RESTART GAME
          </button>
        )}
      </div>

      {/* Game Status */}
      <div style={{
        color: '#888',
        fontSize: '14px',
        textAlign: 'center',
        fontWeight: '500'
      }}>
        {gameState === 'ready' && 'Ready to play!'}
        {gameState === 'playing' && 'Playing... Use arrow keys to move'}
        {gameState === 'paused' && 'Game paused'}
        {gameState === 'gameOver' && 'Game over! Try again?'}
      </div>
    </div>
  );
};

export default GameUI;
