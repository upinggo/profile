# AGENTS.md - Development Guidelines for Agents

## Overview
This is a Next.js 14 profile website with React 18, TypeScript, Jest testing, and static export for GitHub Pages deployment.

## Build, Lint, and Test Commands

### Development
```bash
npm run dev           # Start Next.js dev server (http://localhost:3000)
```

### Building
```bash
npm run build         # Build for static export (outputs to ./out)
npm run preview       # Preview the built static export
```

### Linting & Type Checking
```bash
npm run lint          # Run ESLint with Next.js and TypeScript rules
npm run type-check   # Run TypeScript type checking (noEmit)
```

### Testing
```bash
npm run test              # Run all tests once
npm run test:watch        # Run tests in watch mode (interactive)
npm run test:coverage     # Run tests with coverage report
```

To run a **single test file**, use:
```bash
npx jest path/to/test/file.test.tsx
npx jest src/app/ProfileContainer/page.test.tsx
```

To run a **single test** by name:
```bash
npx jest -t "renders profile data"
```

## Code Style Guidelines

### General
- Use TypeScript for all code (`.ts`/`.tsx` files)
- Enable strict mode in TypeScript (`strictNullChecks: true`)
- Use functional components with hooks (no class components)
- Use Next.js App Router (src/app directory)

### Imports
- Use path aliases: `@/*` for src directory
- Example: `import { useApi } from '@/hooks/useApi';`
- Order imports: external libs → internal aliases → relative paths
- Group: React/Next imports, then hooks, then components, then utils

### Naming Conventions
- **Files**: kebab-case for utilities (`helper-utils.ts`), PascalCase for components (`AiProfileCard.tsx`)
- **Components**: PascalCase (`ProfileContainer`)
- **Hooks**: camelCase with `use` prefix (`useApi`)
- **Types/Interfaces**: PascalCase (`ProfileData`, `AiProfile`)
- **Constants**: camelCase or UPPER_SNAKE_CASE for config constants
- **Variables/Functions**: camelCase

### TypeScript
- Always define prop interfaces for components
- Avoid `any` types (ESLint warns against it)
- Use strict null checks enabled
- Export types from `@/types/index.ts` for shared types
- Example component props:
```typescript
interface AiProfileProps {
  id: string;
  name: string;
  description: string;
  capabilities?: string[];
}
```

### Formatting
- Use Prettier (extends `eslint-config-prettier`)
- 2-space indentation
- Single quotes for strings (except JSX attributes)
- Trailing commas
- ESLint rules enforced: `prefer-const`, `no-var`, `object-shorthand`, `prefer-arrow-callback`

### Error Handling
- Use ErrorBoundary component for catching React errors
- Handle API errors in hooks (useApi returns error state)
- Display user-friendly error messages with retry options
- Console warnings allowed for development (`warn`, `error`)

### Testing
- Test files: `*.test.tsx` or `*.spec.tsx` in same directory as component
- Use Jest with React Testing Library
- Mock external dependencies (hooks, components)
- Test patterns:
  - Render with data
  - Loading states
  - Error states
  - User interactions (click, input)
- Use `jest.clearAllMocks()` in beforeEach
- Use `@testing-library/jest-dom` matchers

### CSS/Styling
- Use CSS Modules (`*.module.css`) in `@/app/styles/`
- Import: `import styles from '@/app/styles/page.module.css';`
- Use: `<div className={styles.profileCard}>`

### Git/Commits
- Follow Conventional Commits (used by semantic-release)
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(profile): add new AI profile card component`

### Project Structure
```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes (if needed)
│   └── styles/       # CSS modules
├── components/       # React components
│   └── common/       # Shared components
├── constants/        # App constants
├── data/             # Static data
├── hooks/            # Custom React hooks
├── types/            # TypeScript interfaces
└── utils/            # Utility functions
```

### Environment Variables
- Use `NEXT_PUBLIC_` prefix for client-side env vars
- `NEXT_PUBLIC_SITE_URL` for GitHub Pages deployment
- `isVercel` for Vercel deployment detection
- Check `process.env.NODE_ENV` for dev/prod distinction
