# Contributing Guidelines

Thank you for considering contributing to this project! This document provides guidelines to help you contribute effectively.

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for our commit messages. This enables automatic versioning and changelog generation.

### Commit Message Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```
feat(auth): add login functionality

Implement user authentication with email and password.
Include JWT token generation and validation.

Closes #123
```

```
fix(api): resolve user creation endpoint error

Fix issue where user creation was failing due to validation errors.
Updated validation schema to handle edge cases.

Fixes #456
```

```
docs(readme): update installation instructions

Add detailed installation steps and prerequisites.
Include troubleshooting section for common issues.
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the commit message format
4. Ensure all tests pass (`npm run test`)
5. Update documentation if needed
6. Submit a pull request with a clear description of changes

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Run tests: `npm run test`

## Code Style

- Follow the existing code style
- Run linter before committing: `npm run lint`
- Ensure type checking passes: `npm run type-check`

## Questions?

Feel free to open an issue if you have any questions or need clarification on anything!