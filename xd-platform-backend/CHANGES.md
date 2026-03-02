# XD Platform Backend — Full Changes Report

## Overview

Complete overhaul of the backend to work seamlessly with the XD Platform frontend.
The frontend is a React-based game store with hardcoded mock data — this update makes the backend serve real data matching those expectations, with working auth, game catalog, community posts, and database seeding.

**Stack:** Express 5 + TypeScript + MongoDB (Mongoose 8) + Zod v4 + bcrypt + JWT

---

## What Changed

### 1. Authentication (Dual Auth: Firebase + JWT)

| Before | After |
|--------|-------|
| Firebase-only auth | Firebase (optional) + bcrypt/JWT email/password auth |
| `POST /auth/login` expects `{ firebaseToken }` | `POST /auth/login` accepts `{ email, password }` |
| `POST /auth/register` expects `{ firebaseUid }` | `POST /auth/register` accepts `{ email, password, username }` |
| No password storage | bcrypt-hashed passwords (salt rounds: 12) |
| Firebase token verification only | JWT tokens (HS256, 24h expiry) as primary auth |

**Why:** Frontend has simple email/password forms with no Firebase SDK.

### 2. Game Model Expansion

| Before | After |
|--------|-------|
| `title, description, thumbnail, gameFile` | All original fields + `slug, price, originalPrice, cover, thumb, gallery, publisher, releaseDate, rating, platforms, tags, reviews` |
| Lookup by MongoDB ObjectId only | Lookup by slug (e.g., `/games/slug/gta-v`) |
| `gameFile` required (S3 refs) | `gameFile` optional |
| No reviews | Embedded reviews array (`user, date, rating, text`) |
| No tag filtering | Tag-based filtering (`?tag=action`) |

**Why:** Frontend expects game data with slug, price, gallery, reviews, etc.

### 3. Community Posts (New Feature)

| Before | After |
|--------|-------|
| No community feature | Full CommunityPost model & API |
| — | `GET /api/v1/community` (list posts, paginated) |
| — | `GET /api/v1/community/:slug` (single post by slug) |
| — | Supports featured posts, related posts, content paragraphs |

**Why:** Frontend has community pages that need backend data.

### 4. Database Seeding

| Before | After |
|--------|-------|
| No seed data | Seed script with 13 games, 3 community posts, 2 test users |
| Manual data entry required | `npm run seed` populates everything |

**Why:** Backend needs data matching the frontend's hardcoded mock data exactly.

### 5. Frontend Wiring

| Before | After |
|--------|-------|
| All data hardcoded in frontend | Auth wired to backend API calls |
| No API client | `src/services/api.ts` with auth header injection |
| No proxy config | Vite proxy forwards `/api` to backend |
| Login/Register pages non-functional | Working login/register with error handling & loading states |

### 6. TypeScript & Build Fixes

| Issue | Fix |
|-------|-----|
| Express 5 `req.params` type (`string \| string[]`) | Cast params to `string` in all controllers |
| Zod v4 `ZodError.errors` removed | Changed to `ZodError.issues` |
| Zod v4 `errorMap` on `z.enum` changed | Simplified to `z.enum([...])` |
| JWT `decoded.role` type mismatch | Cast to `'user' \| 'admin'` |
| `s3Client` not a named export | Changed to `getS3Client()` function call |
| Firebase optional env vars undefined | Added null guard before accessing |
| Mongoose `delete ret.__v` type error | Typed transform params as `any`/`Record` |
| Missing `@types/swagger-jsdoc` | Installed as dev dependency |

### 7. Port & Infrastructure

| Before | After |
|--------|-------|
| Port 5000 (conflicts with macOS AirPlay) | Port 5001 |
| No MongoDB setup guidance | Docker command: `docker run -d --name mongodb -p 27017:27017 mongo:7` |

---

## External Additions (New Dependencies)

| Package | Version | Purpose | Why Added |
|---------|---------|---------|-----------|
| `bcrypt` | ^6.0.0 | Password hashing | Secure email/password auth (OWASP recommended) |
| `jsonwebtoken` | ^9.0.3 | JWT token creation/verification | Stateless auth tokens for API |
| `@types/bcrypt` | ^6.0.0 | TypeScript types | Type safety |
| `@types/jsonwebtoken` | ^9.0.10 | TypeScript types | Type safety |
| `@types/swagger-jsdoc` | (dev) | TypeScript types | Fix TS compilation |

## Dependencies Kept (No Removals)

- `firebase-admin` — kept for Firebase auth support (made optional)
- `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` — kept for S3 file storage (made optional)
- All other existing deps remain unchanged

---

## New Files Created

### Backend

| File | Purpose |
|------|---------|
| `src/config/jwt.ts` | JWT sign/verify helper (`signToken`, `verifyToken`) |
| `src/models/CommunityPost.ts` | Mongoose schema for community posts with related posts subdoc |
| `src/dto/community.dto.ts` | Zod validation for community list endpoint |
| `src/repositories/community.repository.ts` | Database access: `findAll`, `findBySlug`, `countAll`, `create` |
| `src/services/community.service.ts` | Business logic: `listPosts` (paginated), `getPostBySlug` |
| `src/controllers/communityController.ts` | HTTP handlers: `listPosts`, `getPostBySlug` |
| `src/routes/community.ts` | Express routes with Swagger docs |
| `src/seeds/seed.ts` | Database seeder with 13 games, 3 posts, 2 users |

### Frontend

| File | Purpose |
|------|---------|
| `src/services/api.ts` | API client with Bearer token injection, all endpoint functions |

---

## Files Modified

### Backend (17 files)

| File | Changes |
|------|---------|
| `src/config/env.ts` | Added `JWT_SECRET` as required, made Firebase vars optional |
| `src/config/firebase.ts` | Added null guard for optional env vars |
| `src/models/User.ts` | Added `password` field, made `firebaseUid` optional with sparse index |
| `src/models/Game.ts` | Added 12 new fields (slug, price, cover, gallery, publisher, rating, platforms, tags, reviews, etc.) |
| `src/dto/auth.dto.ts` | Replaced Firebase DTOs with email/password login/register DTOs |
| `src/dto/game.dto.ts` | Updated create/update/list DTOs for new game fields, added tag filter |
| `src/dto/upload.dto.ts` | Fixed Zod v4 `z.enum` errorMap syntax |
| `src/dto/user.dto.ts` | Made `firebaseUid` optional in `UserResponseDto` |
| `src/services/auth.service.ts` | Complete rewrite: bcrypt password hashing + JWT token generation |
| `src/services/game.service.ts` | Added `slugify()`, `getGameBySlug()`, fixed S3 client import |
| `src/services/user.service.ts` | Fixed `firebaseUid` optional handling |
| `src/controllers/authController.ts` | Updated for email/password flow |
| `src/controllers/gameController.ts` | Added `getGameBySlug`, fixed Express 5 param types |
| `src/controllers/adminController.ts` | Fixed Express 5 param types |
| `src/controllers/communityController.ts` | New controller for community endpoints |
| `src/middleware/auth.ts` | Changed from Firebase token to JWT verification |
| `src/middleware/errorHandler.ts` | Fixed `ZodError.errors` -> `ZodError.issues` for Zod v4 |
| `src/repositories/user.repository.ts` | Updated `create()`: `firebaseUid` optional, `password` optional |
| `src/repositories/game.repository.ts` | Added `findBySlug()`, tag filter in `findAll`/`countAll` |
| `src/routes/index.ts` | Added community routes mount |
| `src/routes/games.ts` | Added `GET /slug/:slug` route |
| `src/server.ts` | Made Firebase/S3 init conditional (graceful fallback) |
| `package.json` | Added deps, added `"seed"` script |
| `.env` | Set port 5001, JWT_SECRET, local MongoDB URI |
| `.env.example` | Updated with all new env vars and docs |

### Frontend (4 files)

| File | Changes |
|------|---------|
| `src/contexts/AuthContext.tsx` | Wired `login()` and `register()` to call backend APIs, store JWT in localStorage |
| `src/pages/Login.tsx` | Added error/loading state, async form submit with try/catch |
| `src/pages/Register.tsx` | Added error/loading state, async form submit, derives username from email |
| `vite.config.ts` | Added proxy: `/api` -> `http://localhost:5001` |

---

## API Endpoints (Final)

### Auth
```
POST /api/v1/auth/register    { email, password, username } -> { token, user }
POST /api/v1/auth/login       { email, password }           -> { token, user }
GET  /api/v1/auth/profile     (Bearer token required)       -> { user }
```

### Games
```
GET  /api/v1/games                ?page=1&limit=12&search=&tag= -> paginated games
GET  /api/v1/games/:id            (MongoDB ObjectId)             -> single game
GET  /api/v1/games/slug/:slug     (e.g., "gta-v")               -> single game
```

### Community
```
GET  /api/v1/community            -> paginated community posts
GET  /api/v1/community/:slug      -> single post by slug
```

### Admin (requires admin role)
```
POST   /api/v1/admin/upload-url
POST   /api/v1/admin/games
GET    /api/v1/admin/games
PUT    /api/v1/admin/games/:id
DELETE /api/v1/admin/games/:id
```

### Health
```
GET  /api/v1/health               -> { status: 'healthy' }
```

---

## Test Accounts (after seeding)

| Email | Password | Role |
|-------|----------|------|
| `test@xd.com` | `password123` | user |
| `admin@xd.com` | `admin123` | admin |

---

## Seeded Data

### Games (13 total)
GTA V, Rocket League, Fortnite, Red Dead Redemption II, Alan Wake II, Farming Simulator 25, NFS Unbound, Resident Evil 3, Bloodlines 2, Chivalry 2, Deus Ex: Human Revolution, Rumbleverse, Tomb Raider

### Community Posts (3 total)
- "Who is Sonicfox?" (gaming esports)
- "NFS hacks to kill for!" (game tips)
- "Tomb Raider: Definitive Edition" (featured article with related posts)

---

## How to Run

### Prerequisites
- Node.js 18+
- Docker (for MongoDB)

### Setup
```bash
# 1. Start MongoDB via Docker
docker run -d --name mongodb -p 27017:27017 mongo:7

# 2. Backend setup
cd xd-platform-backend/backend
cp .env.example .env        # then edit JWT_SECRET
npm install
npm run seed                 # populate database
npm run dev                  # starts on port 5001

# 3. Frontend setup (separate terminal)
cd xd-platform-frontend
npm install
npm run dev                  # starts on port 5173
```

### Verify
- Backend health: http://localhost:5001/api/v1/health
- API docs: http://localhost:5001/api-docs
- Frontend: http://localhost:5173

---

## Improvements Over Original

1. **Dual auth support** — works with both Firebase (optional, for mobile/social) and email/password (primary, for web)
2. **Rich game catalog** — games now have all metadata for a real store (pricing, gallery, reviews, ratings, platforms)
3. **Slug-based URLs** — SEO-friendly game URLs (`/games/slug/gta-v` instead of `/games/67a4b2c3...`)
4. **Community feature** — full community posts system matching the frontend design
5. **Database seeding** — one command (`npm run seed`) to populate dev data matching frontend mocks
6. **Frontend integration** — auth context wired to actual API calls with error handling
7. **Graceful degradation** — Firebase and S3 init are fully optional (won't crash if not configured)
8. **TypeScript clean build** — zero `tsc --noEmit` errors, production-ready compilation
9. **Express 5 compatibility** — all param types properly handled for Express 5's stricter typing
10. **Zod v4 compatibility** — error handling and validation updated for Zod v4 API changes
