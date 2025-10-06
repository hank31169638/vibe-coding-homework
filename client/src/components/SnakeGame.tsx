import { useEffect, useCallback } from 'react';
import { useSnakeGame } from '../lib/stores/useSnakeGame';
import { useAudio } from '../lib/stores/useAudio';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';

const SnakeGame = () => {
  const {
    gameState,
    snake,
    food,
    direction,
    score,
    highScore,
    difficulty,
    slowEffect,
    gameLoop,
    changeDirection,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    setDifficulty
  } = useSnakeGame();

  const { 
    playHit, 
    playSuccess, 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    isMuted,
    isMusicPlaying,
    toggleMute,
    toggleMusic
  } = useAudio();

  // Initialize audio on component mount
  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    const hitSnd = new Audio('/sounds/hit.mp3');
    const successSnd = new Audio('/sounds/success.mp3');
    
    setBackgroundMusic(bgMusic);
    setHitSound(hitSnd);
    setSuccessSound(successSnd);
    
    console.log('Audio initialized');
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    console.log('Key pressed:', event.key);
    
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        changeDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        changeDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        changeDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        changeDirection('RIGHT');
        break;
      case ' ':
        event.preventDefault();
        if (gameState === 'playing') {
          pauseGame();
        } else if (gameState === 'paused') {
          resumeGame();
        } else if (gameState === 'gameOver') {
          resetGame();
        } else if (gameState === 'ready') {
          startGame();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (gameState === 'ready' || gameState === 'gameOver') {
          startGame();
        }
        break;
    }
  }, [changeDirection, gameState, startGame, resetGame, pauseGame, resumeGame]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Game loop effect with difficulty-based speed and slow effect
  useEffect(() => {
    let gameInterval: NodeJS.Timeout;

    if (gameState === 'playing') {
      // Base speed based on difficulty: easy = 200ms, medium = 150ms, hard = 100ms
      let speed = difficulty === 'easy' ? 200 : difficulty === 'hard' ? 100 : 150;
      
      // Apply slow effect (1.5x slower)
      if (slowEffect > 0) {
        speed = Math.floor(speed * 1.5);
      }
      
      gameInterval = setInterval(() => {
        const result = gameLoop();
        
        // Play sounds based on game events
        if (result.foodEaten) {
          playSuccess();
        }
        if (result.gameOver) {
          playHit();
        }
      }, speed);
    }

    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, [gameState, difficulty, slowEffect, gameLoop, playHit, playSuccess]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '20px'
    }}>
      <GameUI 
        score={score}
        highScore={highScore}
        gameState={gameState}
        difficulty={difficulty}
        isMuted={isMuted}
        isMusicPlaying={isMusicPlaying}
        onStart={startGame}
        onRestart={resetGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onDifficultyChange={setDifficulty}
        onToggleMute={toggleMute}
        onToggleMusic={toggleMusic}
      />
      
      <GameCanvas 
        snake={snake}
        food={food}
        gameState={gameState}
        slowEffect={slowEffect}
      />

      <div style={{
        color: '#888',
        fontSize: '14px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <p>Use Arrow Keys or WASD to move</p>
        <p>Press SPACE to pause/resume • Press ENTER to start/restart</p>
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#2a2a2a', 
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '5px' }}>Food Types:</p>
          <p><span style={{ color: '#ff4444' }}>🔴 Red</span> = Normal (+10 points)</p>
          <p><span style={{ color: '#ffaa00' }}>🟡 Gold (x2)</span> = Double Points (+20)</p>
          <p><span style={{ color: '#00aaff' }}>🔵 Blue (S)</span> = Slow Effect (easier control)</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
