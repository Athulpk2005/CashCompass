# 🚀 Firebase Deployment Checklist

## Prerequisites ✅

- [x] Firebase project created at https://console.firebase.google.com
- [x] Firebase CLI installed: `npm install -g firebase-tools`
- [x] Git repository ready

---

## Step 1: Build the Frontend

```bash
cd Frontend
npm run build
```

---

## Step 2: Login to Firebase

```bash
firebase login
# Follow the browser prompts to authorize
```

---

## Step 3: Initialize Firebase in Project

```bash
# From project root
firebase init

# Select the following:
# ✓ Hosting: Configure files for Firebase Hosting
#   (use an existing project)
#   (create a new project)
# What do you want to use as your public directory? dist
# Configure as a single-page app (rewrite all URLs to /index.html)? Yes
# Set up automatic builds and deploys with GitHub? No (optional)
```

> **Important:** Select "Use an existing project" and choose your Firebase project.

---

## Step 4: Get Your Firebase Config

1. Go to https://console.firebase.google.com
2. Select your project
3. Click **Project Settings** (gear icon)
4. Scroll to "Your apps" section
5. Click **</> (Web)** icon
6. Register app (e.g., "CashCompass Web")
7. **Copy** the firebaseConfig object

---

## Step 5: Set Environment Variables

### In Firebase Console:
1. Go to **Project Settings**
2. Scroll to "Your apps"
3. Click the **Config** icon (next to your web app)
4. Copy the configuration

### Create `.env.production` in Frontend:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_URL=http://localhost:5000/api  # Change after backend deployment
```

### Or set in Firebase Hosting:
1. Firebase Console → Hosting → **Environment variables**
2. Add each variable with `VITE_` prefix

---

## Step 6: Update Backend CORS

In `Backend/.env`, set your Firebase URL:

```env
# For local development
FRONTEND_URL=http://localhost:5173

# After Firebase deployment (replace with your actual URL)
FRONTEND_URL=https://your-project.web.app
```

---

## Step 7: Deploy Frontend

```bash
firebase deploy --only hosting
```

> **Note:** Your frontend will be available at:
> - `https://your-project.web.app`
> - `https://your-project.firebaseapp.com`

---

## Step 8: Deploy Backend (Render/ Railway)

Since Firebase Functions has cold start issues with Node.js + MongoDB, I recommend **Render** for the backend:

### Deploy Backend to Render:

1. Go to https://dashboard.render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select your CashCompass repo
5. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=your-secret
     FRONTEND_URL=https://your-project.web.app
     ```

6. Click **Create Web Service**

---

## Step 9: Update Frontend API URL

After backend deployment, update the environment:

### In Firebase Console:
1. Hosting → **Environment variables**
2. Add:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   ```

### Redeploy frontend:
```bash
firebase deploy --only hosting
```

---

## 🔗 Connect Everything

| Component | URL |
|-----------|-----|
| Frontend (Firebase) | `https://your-project.web.app` |
| Backend (Render) | `https://your-backend.onrender.com` |
| MongoDB Atlas | `mongodb+srv://...` |

---

## ✅ Final Checklist

- [ ] Frontend deploys successfully
- [ ] CORS configured for Firebase URL
- [ ] Backend deploys successfully
- [ ] MongoDB connection works
- [ ] Login/Register works end-to-end
- [ ] All API calls work from Firebase domain
- [ ] Custom domain configured (optional)

---

## 🆘 Troubleshooting

### CORS Error
```bash
# Check Backend/.env has correct FRONTEND_URL
FRONTREFresh Environment variables in Firebase:
firebase hosting:channel:deploy --expires 7d  # Create preview URL
```

### Build Fails
```bash
# Clear build cache
cd Frontend
rm -rf node_modules/.vite
npm run build
```

### API Calls Fail
1. Check browser console for errors
2. Verify VITE_API_URL is set correctly
3. Ensure backend is running and accessible

---

## 💰 Cost Estimation

| Service | Free Tier | Paid |
|---------|-----------|------|
| Firebase Hosting | 10 GB bandwidth | Pay-as-you-go |
| Render Backend | 750 hours/month | $7/month |
| MongoDB Atlas | 512 MB | $25/month |

**Total: $0/month (free tier) → ~$32/month (production)**
