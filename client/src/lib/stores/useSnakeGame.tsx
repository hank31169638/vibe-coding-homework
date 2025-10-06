import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { generateFood, checkCollision, checkSelfCollision } from '../gameLogic';

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameState = 'ready' | 'playing' | 'paused' | 'gameOver';

interface SnakeGameState {
  // Game state
  gameState: GameState;
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;

  // Actions
  startGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  changeDirection: (newDirection: Direction) => void;
  gameLoop: () => { foodEaten: boolean; gameOver: boolean };
}

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

// Load high score from localStorage
const loadHighScore = (): number => {
  try {
    const stored = localStorage.getItem('snakeHighScore');
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

// Save high score to localStorage
const saveHighScore = (score: number): void => {
  try {
    localStorage.setItem('snakeHighScore', score.toString());
  } catch {
    // Ignore localStorage errors
  }
};

export const useSnakeGame = create<SnakeGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: 'ready',
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    highScore: loadHighScore(),

    startGame: () => {
      console.log('Starting game...');
      const initialSnake = [{ x: 10, y: 10 }];
      const initialFood = generateFood(initialSnake, GRID_WIDTH, GRID_HEIGHT);
      
      set({
        gameState: 'playing',
        snake: initialSnake,
        food: initialFood,
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        score: 0
      });
    },

    resetGame: () => {
      console.log('Resetting game...');
      const initialSnake = [{ x: 10, y: 10 }];
      const initialFood = generateFood(initialSnake, GRID_WIDTH, GRID_HEIGHT);
      
      set({
        gameState: 'ready',
        snake: initialSnake,
        food: initialFood,
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        score: 0
      });
    },

    pauseGame: () => {
      console.log('Pausing game...');
      set({ gameState: 'paused' });
    },

    resumeGame: () => {
      console.log('Resuming game...');
      set({ gameState: 'playing' });
    },

    changeDirection: (newDirection: Direction) => {
      const { direction } = get();
      
      // Prevent reversing into self
      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
      };

      if (opposites[direction] !== newDirection) {
        console.log(`Changing direction to: ${newDirection}`);
        set({ nextDirection: newDirection });
      }
    },

    gameLoop: () => {
      const state = get();
      
      if (state.gameState !== 'playing') {
        return { foodEaten: false, gameOver: false };
      }

      // Update direction
      const currentDirection = state.nextDirection;
      
      // Calculate new head position
      const head = state.snake[0];
      let newHead: Position;

      switch (currentDirection) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (checkCollision(newHead, GRID_WIDTH, GRID_HEIGHT)) {
        console.log('Wall collision detected!');
        const newHighScore = Math.max(state.score, state.highScore);
        if (newHighScore > state.highScore) {
          saveHighScore(newHighScore);
        }
        set({ 
          gameState: 'gameOver',
          highScore: newHighScore 
        });
        return { foodEaten: false, gameOver: true };
      }

      // Check self collision
      if (checkSelfCollision(newHead, state.snake)) {
        console.log('Self collision detected!');
        const newHighScore = Math.max(state.score, state.highScore);
        if (newHighScore > state.highScore) {
          saveHighScore(newHighScore);
        }
        set({ 
          gameState: 'gameOver',
          highScore: newHighScore 
        });
        return { foodEaten: false, gameOver: true };
      }

      // Create new snake with new head
      const newSnake = [newHead, ...state.snake];

      // Check food collision
      const foodEaten = newHead.x === state.food.x && newHead.y === state.food.y;
      
      if (foodEaten) {
        console.log('Food eaten! Score:', state.score + 10);
        // Keep the tail, snake grows
        const newFood = generateFood(newSnake, GRID_WIDTH, GRID_HEIGHT);
        const newScore = state.score + 10;
        const newHighScore = Math.max(newScore, state.highScore);
        
        if (newHighScore > state.highScore) {
          saveHighScore(newHighScore);
        }
        
        set({
          snake: newSnake,
          food: newFood,
          direction: currentDirection,
          score: newScore,
          highScore: newHighScore
        });
        
        return { foodEaten: true, gameOver: false };
      } else {
        // Remove tail, snake doesn't grow
        newSnake.pop();
        
        set({
          snake: newSnake,
          direction: currentDirection
        });
        
        return { foodEaten: false, gameOver: false };
      }
    }
  }))
);
