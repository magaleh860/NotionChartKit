# Biome Setup

This project uses [Biome](https://biomejs.dev/) - a fast, modern toolchain that replaces ESLint and Prettier.

## Why Biome?

- **Fast**: 10-100x faster than ESLint + Prettier
- **All-in-One**: Linting + Formatting in a single tool
- **Zero Config**: Works out of the box with sensible defaults
- **Zero Dependencies**: No plugin hell
- **TypeScript-first**: Built for modern TypeScript projects

## Commands

```bash
# Check for issues (linting + formatting)
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Format code
pnpm format

# Run in CI mode
pnpm exec biome ci .
```

## Editor Setup

### VS Code

1. Install the Biome extension:
   - Open Extensions (`Ctrl+Shift+X`)
   - Search for "Biome"
   - Install `biomejs.biome`

2. The project includes `.vscode/settings.json` which enables:
   - Format on save
   - Auto-fix on save
   - Organize imports on save

### Other Editors

- **IntelliJ/WebStorm**: Biome plugin available
- **Neovim**: LSP support via `biome lsp-proxy`
- **Sublime Text**: Community plugins available

## Configuration

Biome is configured in `biome.json` with:

- **Formatting**: 2-space indent, 100 char line width, single quotes
- **Linting**: Recommended rules + custom overrides
- **Import Organization**: Auto-sort imports
- **Overrides**: Special rules for JSON, Markdown, and Next.js files

## Pre-commit Hook (Optional)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
pnpm exec biome check --staged --no-errors-on-unmatched
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Migration from ESLint/Prettier

Already done! We've:
- ✅ Removed ESLint and Prettier dependencies
- ✅ Removed old config files (`.eslintrc.js`, `.prettierrc`)
- ✅ Added `biome.json` configuration
- ✅ Updated all package.json scripts
- ✅ Updated CI workflows
- ✅ Added VS Code settings

## Learn More

- [Biome Documentation](https://biomejs.dev/)
- [Biome vs ESLint/Prettier](https://biomejs.dev/internals/language-support/)
- [Configuration Reference](https://biomejs.dev/reference/configuration/)
