# Snake Game Application

## Overview

This is a modern web-based Snake game built with React, TypeScript, and Express. The application features a 2D canvas-based game with multiple difficulty levels, special food types (normal, double points, slow effect), audio feedback, and persistent high score tracking. The project uses a full-stack architecture with a Vite-powered React frontend and Express backend, configured for deployment on Replit.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React + TypeScript SPA**
- **Build Tool**: Vite with React plugin, GLSL shader support, and runtime error overlay
- **UI Framework**: Radix UI component library with Tailwind CSS for styling
- **State Management**: Zustand with subscription middleware for game state, audio state, and general game phase management
- **Rendering**: HTML5 Canvas for 2D game rendering (20x20 grid)
- **Font Loading**: Inter font via @fontsource for consistent typography

**Component Structure**
- Modular component architecture with reusable UI components in `client/src/components/ui/`
- Game-specific components: `SnakeGame` (main game container), `GameCanvas` (rendering), `GameUI` (controls and score display)
- Separation of concerns: game logic in `lib/gameLogic.ts`, state management in `lib/stores/`

**State Management Pattern**
- Three separate Zustand stores:
  - `useSnakeGame`: Core game mechanics (snake position, food, direction, scoring)
  - `useAudio`: Audio playback and mute controls
  - `useGame`: High-level game phase management (ready/playing/ended)
- Subscription-based middleware for reactive state updates

### Backend Architecture

**Express.js Server**
- **Entry Point**: `server/index.ts` with request/response logging middleware
- **Route Registration**: Centralized in `server/routes.ts` with `/api` prefix convention
- **Static Serving**: Vite dev server in development, static file serving in production
- **Build Process**: ESBuild bundles server code; Vite bundles client code

**Storage Layer Abstraction**
- Interface-based design (`IStorage`) for data persistence operations
- In-memory implementation (`MemStorage`) currently active
- Designed for easy database integration (schema defined for PostgreSQL via Drizzle ORM)

**Development Workflow**
- HMR (Hot Module Replacement) via Vite in development mode
- Automatic server restart with tsx
- Production build combines both frontend and backend into `dist/` directory

### Data Storage Solutions

**Database Configuration (PostgreSQL via Drizzle ORM)**
- **ORM**: Drizzle with Neon serverless PostgreSQL driver
- **Schema Location**: `shared/schema.ts` for type sharing between client/server
- **Migration Strategy**: Schema-first with `drizzle-kit push` command
- **Current Schema**: Users table with id, username, password fields
- **Note**: Database is configured but not currently used (MemStorage active)

**Client-Side Persistence**
- LocalStorage for high score tracking
- Utility functions in `lib/utils.ts` for localStorage operations

### Authentication and Authorization

Not currently implemented. User schema exists in database configuration but authentication flow is not active.

### External Dependencies

**Runtime Dependencies**
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Frontend Framework**: React 18 with react-dom
- **3D Graphics**: @react-three/fiber, @react-three/drei, @react-three/postprocessing (included but not used in current Snake game implementation)
- **State Management**: Zustand for reactive state
- **UI Components**: Radix UI primitives (@radix-ui/react-*)
- **Styling**: Tailwind CSS with class-variance-authority and clsx utilities
- **Data Fetching**: @tanstack/react-query for API calls
- **Form Handling**: react-hook-form with validation
- **Date Utilities**: date-fns
- **Icons**: lucide-react

**Build Tools**
- **Bundler**: Vite with @vitejs/plugin-react
- **TypeScript**: Full type safety across client and server
- **ESBuild**: Server-side bundling for production
- **PostCSS**: CSS processing with Tailwind and autoprefixer
- **GLSL Plugin**: vite-plugin-glsl for shader support

**Audio Assets**
- Background music, hit sound, and success sound expected in `/sounds/` directory
- HTML5 Audio API for playback

**Database Provisioning**
- Requires `DATABASE_URL` environment variable for Neon PostgreSQL connection
- Drizzle configuration expects migrations in `./migrations/` directory