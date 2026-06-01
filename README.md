npm # Template WhatsApp E-commerce

A lightweight React + Vite storefront template with a persistent cart and WhatsApp checkout integration.

> Note: this repository currently uses Vite and React for local development.

## Prerequisites

- Node.js 18+ recommended
- npm 10+ or compatible package manager

## Install dependencies

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open the URL shown in your terminal, typically `http://localhost:3000`.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Available scripts

- `npm run dev` &mdash; start the development server
- `npm run build` &mdash; build the app for production
- `npm run preview` &mdash; preview the production build locally
- `npm run clean` &mdash; remove generated `dist` and `server.js`
- `npm run lint` &mdash; run TypeScript type checking

## Project structure

- `src/` &mdash; application source files
- `src/components/` &mdash; reusable UI components
- `src/pages/` &mdash; page entrypoints (Astro or page-level components)
- `src/types.ts` &mdash; shared TypeScript types

## Notes

- If you want to migrate this repository to a full Astro template, the current codebase will need an Astro config and Astro package dependencies.
