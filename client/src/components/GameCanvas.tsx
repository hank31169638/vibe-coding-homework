import { useRef, useEffect } from 'react';
import { Position, Food } from '../lib/stores/useSnakeGame';

interface GameCanvasProps {
  snake: Position[];
  food: Food;
  gameState: string;
  slowEffect: number;
}

const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

const GameCanvas = ({ snake, food, gameState, slowEffect }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw food with different colors based on type
    let foodColor = '#ff4444'; // Normal food (red)
    if (food.type === 'double') {
      foodColor = '#ffaa00'; // Double points (gold)
    } else if (food.type === 'slow') {
      foodColor = '#00aaff'; // Slow effect (blue)
    }
    
    ctx.fillStyle = foodColor;
    ctx.fillRect(
      food.position.x * GRID_SIZE + 1,
      food.position.y * GRID_SIZE + 1,
      GRID_SIZE - 2,
      GRID_SIZE - 2
    );
    
    // Draw food type indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const foodCenterX = food.position.x * GRID_SIZE + GRID_SIZE / 2;
    const foodCenterY = food.position.y * GRID_SIZE + GRID_SIZE / 2;
    
    if (food.type === 'double') {
      ctx.fillText('x2', foodCenterX, foodCenterY);
    } else if (food.type === 'slow') {
      ctx.fillText('S', foodCenterX, foodCenterY);
    }

    // Draw snake with slow effect indication
    snake.forEach((segment, index) => {
      // Head is slightly different color, blue tint when slowed
      let snakeColor = index === 0 ? '#44ff44' : '#22cc22';
      if (slowEffect > 0 && index === 0) {
        snakeColor = '#00ffcc'; // Cyan for slowed head
      }
      
      ctx.fillStyle = snakeColor;
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });

    // Draw game over overlay
    if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('Press ENTER to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }

    // Draw pause overlay
    if (gameState === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Press SPACE to continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }

    // Draw ready state
    if (gameState === 'ready') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SNAKE GAME', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Press ENTER to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
    }

    // Draw slow effect indicator
    if (gameState === 'playing' && slowEffect > 0) {
      ctx.fillStyle = 'rgba(0, 170, 255, 0.2)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#00aaff';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`SLOW: ${slowEffect}`, 10, 20);
    }

  }, [snake, food, gameState, slowEffect]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        border: '2px solid #444',
        backgroundColor: '#0a0a0a',
        borderRadius: '8px'
      }}
    />
  );
};

export default GameCanvas;
