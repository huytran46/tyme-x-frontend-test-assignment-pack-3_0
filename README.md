# Tymex Quest Submission

## Features
- Responsive layout, work on mobiles.
- Category-based product filtering.
- Pagination support.
- Unit test coverage > 40%.
- ESLint and Prettier for code quality checks.

## Prerequisites

- **Node.js** (version 18.0 or higher)
- **pnpm** (recommended package manager)

If you don't have pnpm installed, you can install it globally:
```bash
npm install -g pnpm
```

## Setup

1. **Setup tymex-backend**
   ```bash
   cd tymex-backend
   npm install
   ```

2. **Setup tymex-quest**
   ```bash
   cd tymex-quest
   pnpm install
   ```


## tymex-quest' Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── components/         # Page-specific components
│   │   ├── category-chips/ # Category filtering components
│   │   ├── product-filter-panel/ # Product filtering panel
│   │   ├── product-grid/   # Product display grid
│   │   └── product-grid-pagination/ # Pagination components
│   ├── data/              # Data fetching and API logic
│   ├── hooks/             # Custom React hooks
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page component
│   └── providers.tsx      # App providers (React Query, etc.)
├── components/            # Reusable UI components
│   └── ui/               # Base UI components (shadcn/ui)
└── lib/                  # Utility functions and configurations
```

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** TanStack Query (React Query)
- **Unit Testing:** Jest + React Testing Library
- **Package Manager:** pnpm
- **Code Quality:** ESLint + Prettier

## Running the Application

### Start tymex-backend
   ```bash
   cd tymex-backend
   npm run start
   ```

### Development Mode

Start the development server with hot reload:
```bash
cd tymex-quest
pnpm dev
```

The application will be available at [http://localhost:3333](http://localhost:3333)

> **Note:** This project runs on port 3333 instead of the default 3000.

### Production Build

To build the application for production:
```bash
pnpm build
```

To start the production server:
```bash
pnpm start
```

## Testing

This project uses **Jest** with **React Testing Library** for unit testing.

### Available Test Commands

- **Run all tests once:**
  ```bash
  pnpm test
  ```

- **Generate test coverage report:**
  ```bash
  pnpm test:coverage
  ```