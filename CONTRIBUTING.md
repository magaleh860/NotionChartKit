# Contributing to NotionChartKit

Thank you for your interest in contributing to NotionChartKit! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/notionchartkit.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Follow the [setup instructions](./docs/runbooks.md#development)

## Development Workflow

1. Make your changes
2. Write/update tests
3. Run tests: `pnpm test`
4. Run type check: `pnpm type-check`
5. Run linter: `pnpm lint` (or `pnpm lint:fix` to auto-fix)
6. Format code: `pnpm format`
7. Commit your changes (see commit guidelines below)
8. Push to your fork
9. Open a pull request

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or tooling changes

Examples:
```
feat: add bar chart export functionality
fix: resolve Redis connection timeout
docs: update API documentation
```

## Code Style

- Use TypeScript for all code
- Follow Biome formatting and linting rules (runs automatically)
- Write meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Aim for high test coverage
- Test edge cases

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure CI passes
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## Project Structure

```
/apps           - Applications (web, worker)
/packages       - Shared packages
/infra          - Infrastructure configs
/docs           - Documentation
/.github        - GitHub workflows
```

## Questions?

Open an issue or join our community discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
