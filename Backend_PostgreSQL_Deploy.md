# Deploy Backend to Render (Step by Step)

## Step 1: Go to Render Dashboard

1. Open https://dashboard.render.com
2. Sign in with GitHub
3. Click **"New +"** button (top right)
4. Select **"Web Service"**

---

## Step 2: Connect GitHub Repository

1. Under **"GitHub"**, click **"Connect"** next to your CashCompass repo
2. If prompted, install Render on your GitHub account

---

## Step 3: Configure the Web Service

### Settings to enter:

| Field | Value |
|-------|-------|
| **Name** | `cashcompass-api` |
| **Root Directory** | `Backend` ⬅️ IMPORTANT! |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

![Root Directory setting](https://render.com/images/docs/root-directory.png)

> ⚠️ **Important:** Set **Root Directory** to `Backend` so Render knows to look in the Backend folder

---

## Step 4: Add Environment Variables

Scroll down to **"Advanced"** → Click **"Add Environment Variables"**

Add these:

```
KEY                    VALUE
─────────────────────────────────────────────────────
NODE_ENV               production
PORT                  10000
MONGODB_URI           (get from MongoDB Atlas)
JWT_SECRET            7b4a8730e16a4a30406d577bb5d7aaf8885d059ee879fccd0f202aea23f3fb996986bf35aeb3fa07ea2a2d18df965a77812bef5d30a18eaaa604d16a060cb43b
FRONTEND_URL          https://cashcompass-a9996.web.app
```

### Getting MONGODB_URI:
1. Go to https://cloud.mongodb.com
2. Click **"Connect"** → **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database password

---

## Step 5: Select Plan

- **Free** (default) - Select this

---

## Step 6: Create Web Service

Click **"Create Web Service"** button

---

## Step 7: Wait for Deployment

1. Render will install dependencies
2. Build and start the server
3. Status will change from **"Building"** to **"Live"**

---

## After Deployment

Your backend URL: `https://cashcompass-api.onrender.com`

### Test it:
```
https://cashcompass-api.onrender.com/api/health
```

Should return:
```json
{"status":"ok","message":"CashCompass API is running"}
```

---

## Troubleshooting

### "Build Failed"
- Check **"Build Logs"** tab for errors
- Common issues: missing MONGODB_URI, wrong Root Directory

### "Server Error"
- Check **"Logs"** tab
- Make sure MONGODB_URI is correct

### 503 Error (Cold Start)
- Normal for free tier
- First request after idle takes ~30 seconds
