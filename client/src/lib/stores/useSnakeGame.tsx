import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { generateFood, checkCollision, checkSelfCollision } from '../gameLogic';

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameState = 'ready' | 'playing' | 'paused' | 'gameOver';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type FoodType = 'normal' | 'double' | 'slow';

export interface Food {
  position: Position;
  type: FoodType;
}

interface SnakeGameState {
  // Game state
  gameState: GameState;
  snake: Position[];
  food: Food;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  difficulty: Difficulty;
  slowEffect: number;

  // Actions
  startGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  changeDirection: (newDirection: Direction) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  gameLoop: () => { foodEaten: boolean; gameOver: boolean; foodType?: FoodType };
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

// Generate special food with random type
const generateSpecialFood = (snake: Position[], gridWidth: number, gridHeight: number): Food => {
  const position = generateFood(snake, gridWidth, gridHeight);
  
  // 70% normal, 20% double, 10% slow
  const rand = Math.random();
  let type: FoodType = 'normal';
  
  if (rand > 0.9) {
    type = 'slow';
  } else if (rand > 0.7) {
    type = 'double';
  }
  
  return { position, type };
};

export const useSnakeGame = create<SnakeGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: 'ready',
    snake: [{ x: 10, y: 10 }],
    food: { position: { x: 5, y: 5 }, type: 'normal' },
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    highScore: loadHighScore(),
    difficulty: 'medium',
    slowEffect: 0,

    startGame: () => {
      console.log('Starting game...');
      const initialSnake = [{ x: 10, y: 10 }];
      const initialFood = generateSpecialFood(initialSnake, GRID_WIDTH, GRID_HEIGHT);
      
      set({
        gameState: 'playing',
        snake: initialSnake,
        food: initialFood,
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        score: 0,
        slowEffect: 0
      });
    },

    resetGame: () => {
      console.log('Resetting game...');
      const initialSnake = [{ x: 10, y: 10 }];
      const initialFood = generateSpecialFood(initialSnake, GRID_WIDTH, GRID_HEIGHT);
      
      set({
        gameState: 'ready',
        snake: initialSnake,
        food: initialFood,
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        score: 0,
        slowEffect: 0
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

    setDifficulty: (difficulty: Difficulty) => {
      console.log(`Setting difficulty to: ${difficulty}`);
      set({ difficulty });
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
      const foodEaten = newHead.x === state.food.position.x && newHead.y === state.food.position.y;
      
      if (foodEaten) {
        const foodType = state.food.type;
        let pointsEarned = 10;
        let newSlowEffect = state.slowEffect;
        
        // Apply food type effects
        if (foodType === 'double') {
          pointsEarned = 20;
          console.log('Double points food eaten! +20 points');
        } else if (foodType === 'slow') {
          // Slow effect duration based on difficulty: easy=5, medium=7, hard=10 moves
          const slowDuration = state.difficulty === 'easy' ? 5 : state.difficulty === 'hard' ? 10 : 7;
          newSlowEffect = slowDuration;
          console.log(`Slow food eaten! Speed reduced for ${slowDuration} moves`);
        } else {
          console.log('Normal food eaten! +10 points');
        }
        
        // Keep the tail, snake grows
        const newFood = generateSpecialFood(newSnake, GRID_WIDTH, GRID_HEIGHT);
        const newScore = state.score + pointsEarned;
        const newHighScore = Math.max(newScore, state.highScore);
        
        if (newHighScore > state.highScore) {
          saveHighScore(newHighScore);
        }
        
        set({
          snake: newSnake,
          food: newFood,
          direction: currentDirection,
          score: newScore,
          highScore: newHighScore,
          slowEffect: newSlowEffect
        });
        
        return { foodEaten: true, gameOver: false, foodType };
      } else {
        // Remove tail, snake doesn't grow
        newSnake.pop();
        
        // Decrease slow effect
        const newSlowEffect = Math.max(0, state.slowEffect - 1);
        
        set({
          snake: newSnake,
          direction: currentDirection,
          slowEffect: newSlowEffect
        });
        
        return { foodEaten: false, gameOver: false };
      }
    }
  }))
);
