# Manual Firebase Deployment Steps

Since Firebase login is interactive, run these commands in your terminal:

## Step 1: Set Active Project

```bash
cd d:\CashCompass
firebase use cashcompass-a9996
```

## Step 2: Initialize Hosting

```bash
firebase init hosting
```

**Answers:**
- ? What do you want to use as your public directory? **dist**
- ? Configure as a single-page app (rewrite all URLs to /index.html)? **Yes**
- ? Set up automatic builds and deploys with GitHub? **No**

## Step 3: Build Frontend

```bash
cd d:\CashCompass\Frontend
npm run build
```

## Step 4: Deploy to Firebase

```bash
firebase deploy --only hosting
```

## After Deployment

Your app will be at:
- **https://cashcompass-a9996.web.app**
- **https://cashcompass-a9996.firebaseapp.com**

## Step 5: Configure Backend CORS

Edit `Backend/.env`:
```env
FRONTEND_URL=https://cashcompass-a9996.web.app
```

Restart your backend server.
