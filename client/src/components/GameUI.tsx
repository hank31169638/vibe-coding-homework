import { Difficulty } from '../lib/stores/useSnakeGame';

interface GameUIProps {
  score: number;
  highScore: number;
  gameState: string;
  difficulty: Difficulty;
  isMuted: boolean;
  isMusicPlaying: boolean;
  onStart: () => void;
  onRestart: () => void;
  onPause: () => void;
  onResume: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onToggleMute: () => void;
  onToggleMusic: () => void;
}

const GameUI = ({ 
  score, 
  highScore, 
  gameState,
  difficulty,
  isMuted,
  isMusicPlaying,
  onStart, 
  onRestart, 
  onPause, 
  onResume,
  onDifficultyChange,
  onToggleMute,
  onToggleMusic
}: GameUIProps) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      minWidth: '400px'
    }}>
      {/* Title and Audio Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        width: '100%'
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0',
          textAlign: 'center'
        }}>
          🐍 SNAKE GAME
        </h1>
        
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={onToggleMusic}
            style={{
              backgroundColor: isMusicPlaying ? '#44ff44' : '#444',
              color: isMusicPlaying ? '#000000' : '#ffffff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={isMusicPlaying ? 'Stop Music' : 'Play Music'}
          >
            {isMusicPlaying ? '🎵' : '🔇'}
          </button>
          
          <button
            onClick={onToggleMute}
            style={{
              backgroundColor: '#444',
              color: '#ffffff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

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

      {/* Difficulty Selector */}
      {(gameState === 'ready' || gameState === 'gameOver') && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
          backgroundColor: '#2a2a2a',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #444'
        }}>
          <div style={{
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Select Difficulty
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
          }}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => onDifficultyChange(level)}
                style={{
                  backgroundColor: difficulty === level ? '#44ff44' : '#444',
                  color: difficulty === level ? '#000000' : '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase'
                }}
                onMouseOver={(e) => {
                  if (difficulty !== level) {
                    e.currentTarget.style.backgroundColor = '#555';
                  }
                }}
                onMouseOut={(e) => {
                  if (difficulty !== level) {
                    e.currentTarget.style.backgroundColor = '#444';
                  }
                }}
              >
                {level === 'easy' && '🐌 Easy'}
                {level === 'medium' && '🏃 Medium'}
                {level === 'hard' && '🚀 Hard'}
              </button>
            ))}
          </div>
        </div>
      )}

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
