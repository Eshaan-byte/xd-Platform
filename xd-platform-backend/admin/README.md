# Game Platform - Admin Panel

React admin panel for managing games.

## Features

- Admin authentication
- Upload games with thumbnails
- Manage game listings
- Activate/deactivate games
- Delete games

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and API credentials
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Build for production:**
   ```bash
   pnpm build
   pnpm preview
   ```

## Environment Variables

See `.env.example` for all required configuration values.

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Firebase Authentication
- React Router v7
- Axios for API calls
