import { Position } from './stores/useSnakeGame';

/**
 * Generate a random food position that doesn't overlap with the snake
 */
export const generateFood = (snake: Position[], gridWidth: number, gridHeight: number): Position => {
  let food: Position;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    food = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
    attempts++;
  } while (
    attempts < maxAttempts &&
    snake.some(segment => segment.x === food.x && segment.y === food.y)
  );

  return food;
};

/**
 * Check if position is outside game boundaries
 */
export const checkCollision = (position: Position, gridWidth: number, gridHeight: number): boolean => {
  return (
    position.x < 0 ||
    position.x >= gridWidth ||
    position.y < 0 ||
    position.y >= gridHeight
  );
};

/**
 * Check if position collides with snake body
 */
export const checkSelfCollision = (position: Position, snake: Position[]): boolean => {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
};

/**
 * Calculate distance between two positions
 */
export const getDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};
