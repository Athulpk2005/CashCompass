# CashCompass Firebase Deployment Guide

## ⚠️ Important Architecture Considerations

This project has two parts that need different hosting approaches:

1. **Frontend (React)** → Deploy to **Firebase Hosting** ✅
2. **Backend (Express.js)** → Deploy to **Firebase Functions** ⚠️

> **Note:** This project uses MongoDB Atlas which works with Firebase Functions, but Firebase also offers **Cloud Firestore** as an alternative database.

---

## Prerequisites

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Create a Firebase project at https://console.firebase.google.com

---

## Option 1: Frontend Only (Recommended for Starters)

Deploy only the React frontend to Firebase Hosting:

### 1. Configure Firebase Hosting

Create `firebase.json` in the Frontend directory:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

### 2. Update API Configuration

Update [`Frontend/src/config/api.js`](Frontend/src/config/api.js) to point to your deployed backend:

```javascript
// Change this to your backend URL
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com'  // Your deployed backend URL
  : 'http://localhost:5000';         // Local development
```

### 3. Build and Deploy

```bash
cd Frontend
npm run build
firebase init hosting
# Select your Firebase project
# Use 'dist' as public directory
# Configure as single-page app: Yes
firebase deploy --only hosting
```

---

## Option 2: Full Stack (Frontend + Backend on Firebase Functions)

### 1. Initialize Firebase Functions

```bash
firebase init functions
# Select your Firebase project
# Language: JavaScript or TypeScript
# Install dependencies: Yes
```

### 2. Configure Backend for Firebase Functions

Create/modify `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Initialize Firebase admin for notifications (optional)
// const admin = require('firebase-admin');
// admin.initializeApp();

const app = express();

// Security middleware
app.use(cors({
  origin: true, // Allow all origins in functions
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Import routes (you'll need to adapt these)
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalRoutes = require('./routes/goalRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CashCompass API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export as Firebase Function
exports.api = functions.https.onRequest(app);
```

### 3. Configure Firebase Database (Optional - Use MongoDB Atlas)

Keep using MongoDB Atlas, just update your connection string in `.env`:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cashcompass?retryWrites=true&w=majority
```

### 4. Configure CORS for Firebase Functions

Update [`Backend/server.js`](Backend/server.js) to allow Firebase domain:

```javascript
// In production, allow your Firebase hosting URL
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-project.web.app'  // Firebase hosting URL
    : 'http://localhost:5173',         // Local development
  credentials: true
};
```

### 5. Deploy Everything

```bash
# Deploy functions and hosting
firebase deploy

# Or deploy separately
firebase deploy --only functions
firebase deploy --only hosting
```

---

## Option 3: Use Firebase Products Instead of MongoDB (Alternative)

Replace MongoDB with Firebase Firestore:

### 1. Install Firebase Admin SDK

```bash
cd Backend
npm install firebase-admin
```

### 2. Initialize Firestore

Create `config/firestore.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../cashcompass-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
```

### 3. Rewrite Models for Firestore

Example - Convert `User.js` model:

```javascript
const db = require('../config/firestore');

class User {
  constructor(email, password, name) {
    this.email = email;
    this.password = password; // Hash with bcrypt before saving
    this.name = name;
    this.createdAt = new Date().toISOString();
  }

  async save() {
    const docRef = await db.collection('users').add(this);
    return { id: docRef.id, ...this };
  }

  static async findByEmail(email) {
    const snapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = User;
```

---

## Environment Variables

Create `.env` file in Backend:

```env
# MongoDB Atlas (for Options 1 & 2)
MONGODB_URI=mongodb+srv://your_connection_string

# JWT Secret (generate a strong one)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Firebase Config (for Option 3)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email

# CORS Origin (Firebase hosting URL)
FRONTEND_URL=https://your-project.web.app
```

---

## Deployment Commands Summary

```bash
# 1. Build frontend
cd Frontend
npm run build

# 2. Initialize Firebase (first time only)
firebase login
firebase init
# Select: Hosting + Functions
# Use existing Firebase project

# 3. Deploy
firebase deploy
```

---

## After Deployment

1. **Update API URL** in Frontend to point to your deployed backend
2. **Configure custom domain** in Firebase Console (optional)
3. **Set up SSL** - Firebase provides automatic SSL
4. **Monitor** - Check Firebase Console for usage and logs

---

## Troubleshooting

### CORS Errors
- Ensure your Firebase hosting URL is in the CORS whitelist
- Check that your backend allows the Firebase domain

### Cold Starts (Firebase Functions)
- Firebase Functions have cold start latency
- Consider keeping a ping endpoint warm with a scheduled function

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check that connection string is correct in environment variables

---

## Estimated Costs (Free Tier)

| Service | Free Limit |
|---------|-----------|
| Firebase Hosting | 10 GB storage, 10 GB bandwidth/month |
| Firebase Functions | 2M invocations/month |
| Cloud Firestore | 1 GB storage, 50K reads/day |
| MongoDB Atlas Free | 512 MB storage |

This setup is **completely free** for development and small production use! 🚀
