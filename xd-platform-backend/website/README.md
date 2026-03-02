# Game Platform - Website

Next.js website for browsing and downloading games.

## Features

- Browse game catalog
- View game details
- Download games (authenticated users)
- User registration and login
- Download history

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Firebase and API credentials
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Build for production:**
   ```bash
   pnpm build
   pnpm start
   ```

## Environment Variables

See `.env.local.example` for all required configuration values.

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Axios for API calls
