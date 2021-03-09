# serverless-cli-scripts
CLI scripts for Serverless Services

# Installation

This is a public package, so you can just

```bash
# Yarn
yarn add --dev @comicrelief/serverless-cli-scripts

# NPM
npm install --save-dev @comicrelief/serverless-cli-scripts
```

# Usage

## Runner

To create a CLI application, you can import the `runner` function from `@comicrelief/serverless-cli-scripts` (or `@comicrelief/serverless-cli-scripts/runner` for tree shaking).

The `runner` function expects a context object defined as follows:

- `getArgs` function (generated via `yargs`)
- `loadEnv` function that will load the environment variables in your execution context
- `commands` mapping of commands -> executor

See `@comicrelief/serverless-cli-scripts/runner.ts` for the types.

## Deploy

The `deploy` function is exported in the following paths:

- `@comicrelief/serverless-cli-scripts`
- `@comicrelief/serverless-cli-scripts/commands/deploy`

You can import the function and pass it to the `commands` object expected by the `runner` function
