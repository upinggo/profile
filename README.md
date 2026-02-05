# Professional Developer Profile

A modern, responsive portfolio website built with Next.js 14, TypeScript, and React. This project showcases professional skills, technology stack, and AI profiles in an elegant, accessible interface.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 14 App Router, TypeScript, and React Server Components
- **Responsive Design**: Fully responsive layout that works on all devices
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels and semantic HTML
- **Performance Optimized**: Optimized for Core Web Vitals with efficient loading strategies
- **Type Safety**: Comprehensive TypeScript typing throughout the application
- **Error Handling**: Graceful error boundaries and fallback UIs
- **Loading States**: Skeleton loading screens for better UX
- **SEO Optimized**: Proper meta tags, Open Graph, and Twitter cards
- **Testing Ready**: Jest and React Testing Library setup with sample tests
- **Automated Releases**: Semantic Release for automatic versioning and changelog generation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint with TypeScript plugin
- **Deployment**: GitHub Pages ready
- **Release Automation**: Semantic Release with Conventional Commits

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router structure
│   ├── api/               # API routes
│   ├── Blog/             # Blog section
│   ├── ProfileContainer/ # Main profile page
│   ├── TechnologyStackContainer/ # Tech stack showcase
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Home page
├── components/           # Reusable React components
│   ├── common/          # Shared components
│   ├── AiProfileCard.tsx # AI profile display component
│   ├── ErrorBoundary.tsx # Error handling component
│   └── SkeletonLoader.tsx # Loading skeleton components
├── constants/           # Application constants
├── data/               # Static data files
├── hooks/              # Custom React hooks
├── styles/             # Global styles
├── types/              # TypeScript interfaces
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/upinggo/profile.git

# Navigate to project directory
cd profile

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Build and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Automated Releases

This project uses **Semantic Release** for automatic versioning and release management:

### How it works
- Commits following [Conventional Commits](https://www.conventionalcommits.org/) format trigger automated releases
- Version numbers are bumped automatically based on commit types
- Changelog is generated automatically
- GitHub releases are created with release notes
- Git tags are created for each release

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New features (creates minor version bump)
- `fix`: Bug fixes (creates patch version bump)
- `BREAKING CHANGE`: Breaking changes (creates major version bump)
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Maintenance tasks

### Example Commits
```bash
# Feature - creates minor version bump (1.0.0 → 1.1.0)
git commit -m "feat(auth): add user login functionality"

# Fix - creates patch version bump (1.0.0 → 1.0.1)
git commit -m "fix(api): resolve user creation validation error"

# Breaking Change - creates major version bump (1.0.0 → 2.0.0)
git commit -m "feat!: remove deprecated user endpoints

BREAKING CHANGE: User v1 endpoints have been removed"
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage
- `npm run type-check` - Run TypeScript type checking
- `npm run semantic-release` - Run semantic release locally

## 🎨 Styling Approach

This project uses a hybrid approach:
- **Tailwind CSS** for utility classes and rapid prototyping
- **CSS Modules** for component-specific styling
- **Global CSS** for base styles and variables

## 🔒 Type Safety

Comprehensive TypeScript interfaces are defined in `src/types/index.ts` covering:
- Profile and AI profile data structures
- Technology stack categories
- API response formats
- Component props and state

## 🌐 API Integration

The application includes mock API endpoints that can be easily replaced with real backend services:
- `/api/profile` - Profile data endpoint
- `/api/tech-stack` - Technology stack endpoint

## 📱 Responsive Design

The application is fully responsive and tested on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## ♿ Accessibility Features

- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

## 🚀 Performance Optimizations

- Code splitting with dynamic imports
- Image optimization
- Efficient caching strategies
- Lazy loading components
- Bundle size optimization

## 🤝 Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

Key points:
1. Follow [Conventional Commits](https://www.conventionalcommits.org/) format
2. Ensure all tests pass before submitting PR
3. Update documentation as needed
4. Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- TypeScript community for type safety
- React team for the component library
- All contributors and supporters

---

Built with ❤️ using Next.js and TypeScript