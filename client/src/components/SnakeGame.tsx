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
    gameLoop,
    changeDirection,
    startGame,
    resetGame,
    pauseGame,
    resumeGame
  } = useSnakeGame();

  const { playHit, playSuccess } = useAudio();

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

  // Game loop effect
  useEffect(() => {
    let gameInterval: NodeJS.Timeout;

    if (gameState === 'playing') {
      gameInterval = setInterval(() => {
        const result = gameLoop();
        
        // Play sounds based on game events
        if (result.foodEaten) {
          playSuccess();
        }
        if (result.gameOver) {
          playHit();
        }
      }, 150); // Game speed - adjust as needed
    }

    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, [gameState, gameLoop, playHit, playSuccess]);

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
        onStart={startGame}
        onRestart={resetGame}
        onPause={pauseGame}
        onResume={resumeGame}
      />
      
      <GameCanvas 
        snake={snake}
        food={food}
        gameState={gameState}
      />

      <div style={{
        color: '#888',
        fontSize: '14px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <p>Use Arrow Keys or WASD to move</p>
        <p>Press SPACE to pause/resume • Press ENTER to start/restart</p>
      </div>
    </div>
  );
};

export default SnakeGame;
