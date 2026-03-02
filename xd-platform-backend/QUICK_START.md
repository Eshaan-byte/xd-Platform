# Quick Start Guide - Local Development

Get your game distribution platform running locally in minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] MongoDB installed locally
- [ ] MongoDB Compass installed
- [ ] Firebase project created
- [ ] AWS account with S3 bucket

---

## Step 1: Install MongoDB Locally

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Windows
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer (install as service)
3. MongoDB starts automatically

### Linux
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Install MongoDB Compass
- Download from: https://www.mongodb.com/try/download/compass
- Connect to: `mongodb://localhost:27017`

---

## Step 2: Install Project Dependencies

```bash
cd /Users/anas/XD-PLATFORM
pnpm install
```

This will install dependencies for all three projects (backend, website, admin).

---

## Step 3: Configure Environment Variables

### Backend Configuration
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```bash
# Already configured for local MongoDB
MONGODB_URI=mongodb://localhost:27017/game-platform

# Get from Firebase Console > Project Settings > Service Accounts
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Get from AWS Console > IAM > Users
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
```

### Website Configuration
```bash
cd ../website
cp .env.local.example .env.local
```

Edit `website/.env.local`:
```bash
# Get from Firebase Console > Project Settings > General
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Admin Configuration
```bash
cd ../admin
cp .env.example .env
```

Edit `admin/.env`:
```bash
# Same Firebase config as website (use VITE_ prefix)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_API_URL=http://localhost:5000/api
```

---

## Step 4: Setup Firebase

1. Go to https://console.firebase.google.com
2. Create new project or select existing
3. Enable **Authentication** > **Email/Password**
4. Get **Client SDK config** (for website & admin):
   - Project Settings > General > Your apps
   - Copy the config values
5. Get **Admin SDK credentials** (for backend):
   - Project Settings > Service Accounts
   - Click "Generate new private key"
   - Extract values from downloaded JSON

---

## Step 5: Setup AWS S3

1. Create S3 bucket in AWS Console
2. Configure CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. Create IAM user with S3 permissions
4. Generate access keys
5. Add credentials to `backend/.env`

---

## Step 6: Verify MongoDB is Running

```bash
# macOS
brew services list | grep mongodb

# Windows - check Services app

# Linux
sudo systemctl status mongod
```

**Connect with MongoDB Compass:**
- Connection string: `mongodb://localhost:27017`
- Should connect successfully

---

## Step 7: Start Development Servers

Open **3 terminal windows**:

### Terminal 1 - Backend
```bash
cd /Users/anas/XD-PLATFORM
pnpm backend:dev
```
✅ Runs on http://localhost:5000
✅ API docs: http://localhost:5000/api-docs

### Terminal 2 - Website
```bash
cd /Users/anas/XD-PLATFORM
pnpm website:dev
```
✅ Runs on http://localhost:3000

### Terminal 3 - Admin Panel
```bash
cd /Users/anas/XD-PLATFORM
pnpm admin:dev
```
✅ Runs on http://localhost:5173

---

## Step 8: Create First Admin User

1. Open website: http://localhost:3000
2. Click "Sign Up"
3. Register with email/password
4. Open MongoDB Compass
5. Connect to `mongodb://localhost:27017`
6. Navigate: `game-platform` > `users` collection
7. Find your user document
8. Edit: Change `role` from `"user"` to `"admin"`
9. Save changes

**Or use mongosh:**
```bash
mongosh mongodb://localhost:27017/game-platform

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

---

## Step 9: Test the Platform

### Test Website (User Flow)
1. Visit http://localhost:3000
2. Register a new user
3. Browse games (empty initially)
4. Check profile page

### Test Admin Panel (Admin Flow)
1. Visit http://localhost:5173
2. Login with admin account
3. Click "Upload Game"
4. Upload:
   - Game file (.zip, .rar, or .exe)
   - Thumbnail image (.jpg, .png, or .webp)
   - Title and description
5. Click "Upload Game"
6. View uploaded game in "Games" list
7. Test activate/deactivate
8. Check game appears on website

### Test Download Flow
1. Go to website
2. Login as regular user
3. Click on a game
4. Click "Download Game"
5. File should download from S3

---

## Verification Checklist

- [ ] MongoDB running and accessible
- [ ] Backend server started successfully
- [ ] Website loads at localhost:3000
- [ ] Admin panel loads at localhost:5173
- [ ] Can register user on website
- [ ] Can create admin user in MongoDB
- [ ] Can login to admin panel
- [ ] Can upload game via admin
- [ ] Game appears on website
- [ ] Can download game as user
- [ ] Swagger docs accessible at localhost:5000/api-docs

---

## Troubleshooting

### MongoDB Connection Failed
```bash
# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod           # Linux
# Windows: Restart MongoDB service via Services app
```

### Backend Won't Start
- Check `.env` file exists and has all required values
- Verify MongoDB is running
- Check port 5000 is not in use

### Website/Admin Won't Start
- Check `.env.local` (website) or `.env` (admin) exists
- Verify Firebase config is correct
- Check ports 3000/5173 are not in use

### Can't Upload Files
- Verify AWS credentials in backend/.env
- Check S3 bucket CORS configuration
- Ensure S3 bucket exists and is accessible

### Detailed Logs
All projects use structured logging. Check console output for errors.

---

## Useful Commands

```bash
# Install all dependencies
pnpm install

# Start individual servers
pnpm backend:dev
pnpm website:dev
pnpm admin:dev

# Build for production
pnpm backend:build
pnpm website:build
pnpm admin:build

# View MongoDB data
mongosh mongodb://localhost:27017/game-platform
> show collections
> db.users.find()
> db.games.find()
```

---

## Next Steps

Once everything is working:
1. Upload more test games
2. Test all features thoroughly
3. Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details
4. Review [MONGODB_SETUP.md](MONGODB_SETUP.md) for MongoDB management
5. When ready, plan production deployment

---

## Support

If you encounter issues:
1. Check all services are running (MongoDB, backend, website, admin)
2. Verify all .env files are configured correctly
3. Check console logs for error messages
4. Ensure all prerequisites are installed
5. Try restarting services

Happy coding! 🚀
