# XD Platform - Game Distribution MVP

A modern game distribution platform built with TypeScript, featuring a backend API, user-facing website, and admin panel.

## Project Structure

```
XD-PLATFORM/
├── backend/     # Express TypeScript API
├── website/     # Next.js user-facing website
├── admin/       # React admin panel (Vite)
└── README.md
```

## Tech Stack

### Backend
- **Framework:** Express 5.x + TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** Firebase Admin SDK
- **Storage:** AWS S3
- **Validation:** Zod
- **Logging:** Pino
- **Documentation:** Swagger/OpenAPI

### Website
- **Framework:** Next.js 15+ with App Router
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Client SDK

### Admin Panel
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Client SDK

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Community Edition (local installation)
- MongoDB Compass (GUI for MongoDB)
- Firebase project (Email/Password auth enabled)
- AWS account with S3 bucket

### Installation

1. **Install dependencies for all projects:**
   ```bash
   pnpm install
   ```

2. **Setup environment variables:**
   - Copy `.env.example` files in each project
   - Fill in your credentials

3. **Start development servers:**
   ```bash
   # Backend API (port 5000)
   pnpm backend:dev

   # Website (port 3000)
   pnpm website:dev

   # Admin Panel (port 5173)
   pnpm admin:dev
   ```

## Features

### User Features (Website)
- Browse available games
- Download games (authenticated users)
- View download history
- User registration and login

### Admin Features (Admin Panel)
- Upload new games with thumbnails
- Manage game listings
- Activate/deactivate games
- Delete games

## API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:5000/api-docs
- **API Base:** http://localhost:5000/api

## Architecture

This project follows an enterprise 5-layer architecture pattern:
1. **Models** - Database schemas
2. **DTOs** - Validation schemas
3. **Repositories** - Data access layer
4. **Services** - Business logic
5. **Controllers** - HTTP handlers

## License

MIT
