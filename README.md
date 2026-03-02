# XD Platform - Gaming Discovery Platform

A full-stack gaming platform for browsing, discovering, and exploring games. Built with React, Express, and MongoDB.

**Live Demo:** [https://xd-platform.onrender.com](https://xd-platform.onrender.com)

## Features

- Browse 48+ real games with images, prices, ratings, and descriptions
- Game detail pages with screenshot galleries and platform info
- Community posts and discussions
- Search and filter games by category/tag
- User authentication (register, login, profile)
- Responsive dark-themed UI

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 7
- Tailwind CSS
- React Router

### Backend
- Express 5 + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt password hashing

### Data Sources
- [RAWG API](https://rawg.io/apidocs) - Game metadata, images, screenshots
- [CheapShark API](https://apidocs.cheapshark.com/) - Real game prices

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- RAWG API key (free from [https://rawg.io/apidocs](https://rawg.io/apidocs))

### Backend Setup

```bash
cd xd-platform-backend/backend
npm install
```

Create a `.env` file:

```env
NODE_ENV=development
PORT=5001
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/game-platform
JWT_SECRET=your-secret-key
RAWG_API_KEY=your-rawg-api-key
LOG_LEVEL=debug
```

Seed the database with real game data:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd xd-platform-frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend.

### Test Account

After seeding, you can log in with:
- **Email:** test@xd.com
- **Password:** password123

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/profile` | Get user profile (auth required) |
| GET | `/api/v1/games` | List games (supports `?search=`, `?tag=`, `?limit=`, `?page=`) |
| GET | `/api/v1/games/slug/:slug` | Get game by slug |
| GET | `/api/v1/community` | List community posts |
| GET | `/api/v1/community/:slug` | Get community post by slug |

## Deployment

The app is deployed on:
- **Frontend:** Render Static Site
- **Backend:** Render Web Service
- **Database:** MongoDB Atlas (free tier)

## Project Structure

```
xd-platform/
├── xd-platform-frontend/     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── contexts/          # Auth context
│   │   ├── services/          # API client
│   │   └── data/              # Static data/types
│   └── public/                # Static assets
│
└── xd-platform-backend/      # Express backend
    └── backend/
        └── src/
            ├── config/        # DB, env, logger config
            ├── controllers/   # Route handlers
            ├── dto/           # Data transfer objects
            ├── middleware/    # Auth, error handling
            ├── models/        # Mongoose schemas
            ├── repositories/  # Data access layer
            ├── routes/        # API routes
            ├── seeds/         # Database seeder
            └── services/      # Business logic
```
