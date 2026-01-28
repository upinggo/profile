# Profile App

This is a profile application built with React and Next.js. It serves as a showcase for AI generator profiles and allows users to manage their AI assistant configurations.

## Features

- Interactive profile display
- AI profile management
- Responsive design
- Static export for GitHub Pages hosting

## Tech Stack

- React 18
- Next.js 14 (with App Router)
- TypeScript
- CSS Modules

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for GitHub Pages

To build a static version for GitHub Pages, run:

```bash
npm run build
```

This creates a `out` directory with the static files. To serve locally:

```bash
npx serve out
```

## Deploying to GitHub Pages

### Option 1: Using GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - run: npm install
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### Option 2: Manual Deployment

1. Run `npm run build` to generate the static site in the `out` directory
2. Copy the contents of the `out` directory to your GitHub Pages branch (usually gh-pages)

## Project Structure

- `src/app/` - Main application files using the App Router
- `src/app/api/` - API routes
- `src/app/components/` - Reusable React components
- `src/app/styles/` - Global and module-specific styles
- `public/` - Static assets

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!