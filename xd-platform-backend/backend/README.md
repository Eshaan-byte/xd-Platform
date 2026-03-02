# Game Platform Backend API

Express TypeScript API with MongoDB, Firebase Auth, and AWS S3 integration.

## Features

- Firebase Admin SDK for authentication
- MongoDB with Mongoose ORM
- AWS S3 for file storage
- Zod validation
- Pino logging
- Swagger/OpenAPI documentation
- Rate limiting and security (Helmet, CORS)
- Enterprise 5-layer architecture

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run start:prod
   ```

## API Documentation

- Swagger UI: http://localhost:5000/api-docs
- API Base URL: http://localhost:5000/api

## Environment Variables

See `.env.example` for all required configuration values.

### Firebase Setup
1. Create project at https://console.firebase.google.com
2. Enable Email/Password authentication
3. Go to Project Settings > Service Accounts
4. Generate new private key (JSON)
5. Extract values for FIREBASE_* variables

### AWS S3 Setup
1. Create S3 bucket
2. Configure CORS policy
3. Create IAM user with S3 permissions
4. Generate access keys

### MongoDB Setup (Local)
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Install MongoDB Compass from https://www.mongodb.com/try/download/compass
3. Start MongoDB service:
   - macOS: `brew services start mongodb-community`
   - Windows: MongoDB runs as a service automatically
   - Linux: `sudo systemctl start mongod`
4. Connect via MongoDB Compass to `mongodb://localhost:27017`
5. Database `game-platform` will be created automatically on first connection

## Architecture

```
src/
├── config/        # Configuration (env, db, logger, firebase, s3)
├── models/        # Mongoose schemas
├── dto/           # Zod validation schemas
├── repositories/  # Data access layer
├── services/      # Business logic
├── controllers/   # HTTP handlers
├── routes/        # Express routes
├── middleware/    # Custom middleware
├── types/         # TypeScript types
├── app.ts         # Express app setup
└── server.ts      # Server entry point
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login with Firebase token
- GET `/api/auth/profile` - Get user profile

### Games
- GET `/api/games` - List all active games
- GET `/api/games/:id` - Get game details
- GET `/api/games/:id/download` - Get download URL (auth required)

### Admin
- POST `/api/admin/upload` - Upload new game (admin only)
- GET `/api/admin/games` - List all games (admin only)
- PUT `/api/admin/games/:id` - Update game (admin only)
- DELETE `/api/admin/games/:id` - Delete game (admin only)
