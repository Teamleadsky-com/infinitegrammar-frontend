# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a German language learning application focused on Cloze tests (gap-fill exercises). The app allows users to practice German grammar at different proficiency levels (A1-C1) across various topics like verbs, adjectives, articles, and prepositions.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: @tanstack/react-query for async state, local state with React hooks
- **Form Handling**: react-hook-form with zod validation
- **Icons**: lucide-react
- **Development**: Uses SWC for fast compilation

## Development Commands

```bash
# Start development server (runs on http://[::]:8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Routing Structure

The app uses React Router with the following main routes defined in `src/App.tsx`:
- `/` - LevelSelection page (main landing)
- `/exercise` - Exercise page with cloze test UI
- `/statistics` - User statistics and progress
- `/auth` - Authentication (login/register)
- `/profile` - User profile management
- `*` - NotFound page for undefined routes

### Key Pages

1. **LevelSelection** (`src/pages/LevelSelection.tsx`)
   - Main landing page with level (A1-C1) and topic selection
   - Authentication state management via localStorage
   - Navigates to exercises with query parameters (`?level=` or `?section=`)

2. **Exercise** (`src/pages/Exercise.tsx`)
   - Core cloze test interface with interactive gap-fill functionality
   - Uses custom `GapSelector` component for dropdown option selection
   - Mock data structure with exercise text and gap objects containing position, options, and correct answer indices
   - Feedback system with success/error animations and visual indicators
   - Shows correct answers when user selects wrong option

3. **Auth** (`src/pages/Auth.tsx`)
   - Tabbed interface for login and registration
   - Mock authentication using localStorage (keys: `isLoggedIn`, `userEmail`, `userName`)
   - Includes magic link functionality

### Component Structure

- **UI Components**: Located in `src/components/ui/` - full shadcn/ui component library with extensive Radix UI primitives
- **Custom Hooks**: `src/hooks/use-toast.ts` for toast notifications, `src/hooks/use-mobile.tsx` for responsive design
- **Utils**: `src/lib/utils.ts` for utility functions (including `cn` for class name merging)

### Styling System

The design system is defined in `src/index.css` with:
- CSS custom properties for colors (HSL format required)
- Light and dark theme support via `.dark` class
- Custom animations: `fade-in`, `scale-in`, `celebrate`, `shake`
- Gradient utilities: `gradient-primary`, `gradient-success`, `gradient-card`
- Custom shadow system with primary color tint
- All colors must be defined in HSL format

### Path Aliases

TypeScript path alias `@/*` maps to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)

## Exercise Data Structure

Exercises use the following mock data format:
```typescript
{
  id: number,
  level: string,      // e.g., "B1"
  section: string,    // e.g., "Verben"
  text: string,       // Full text with gap placeholders
  gaps: [
    {
      id: number,
      position: number,    // Character index in text
      options: string[],   // Array of answer choices
      correct: number      // Index of correct option
    }
  ]
}
```

## TypeScript Configuration

The project uses lenient TypeScript settings (`noImplicitAny: false`, `strictNullChecks: false`) to allow for rapid development. Consider this when adding type annotations.

## Authentication Flow

Currently uses localStorage for mock authentication:
- Login/register sets `isLoggedIn`, `userEmail`, `userName` in localStorage
- Logout clears these values
- No backend integration yet - authentication is client-side only

## Vite Configuration

- Dev server runs on port 8080 with IPv6 support (`::``)
- SWC plugin for faster React compilation
