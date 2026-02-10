# Deploy Backend to Render (For CashCompass-Frontend&backend Repo)

## Step 1: Go to Render Dashboard

1. Open https://dashboard.render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**

---

## Step 2: Connect Your Repository

1. Under GitHub, find and click **"Connect"** next to **"CashCompass-Frontend&backend"**
2. If asked, install Render on GitHub

---

## Step 3: Configure Service

Enter these settings:

| Field | Value |
|-------|-------|
| **Name** | `cashcompass-api` |
| **Root Directory** | `Backend` ⬅️ CRITICAL! |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

**Where to find Root Directory:**
- After connecting repo, you'll see a dropdown or field
- Type `Backend` in the Root Directory field
- This tells Render to look in the Backend folder

---

## Step 4: Add Environment Variables

Click **"Add Environment Variables"** and add:

```
KEY                    VALUE
─────────────────────────────────────────────────────
NODE_ENV               production
PORT                   10000
MONGODB_URI            mongodb+srv://... (from MongoDB Atlas)
JWT_SECRET             7b4a8730e16a4a30406d577bb5d7aaf8885d059ee879fccd0f202aea23f3fb996986bf35aeb3fa07ea2a2d18df965a77812bef5d30a18eaaa604d16a060cb43b
FRONTEND_URL           https://cashcompass-a9996.web.app
```

**Getting MONGODB_URI:**
1. Go to https://cloud.mongodb.com
2. Click your cluster → **"Connect"** → **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your actual password

---

## Step 5: Select Plan

Choose **"Free"** (default)

---

## Step 6: Create Service

Click **"Create Web Service"** and wait for deployment

---

## Step 7: Verify Deployment

Your URL: `https://cashcompass-api.onrender.com`

Test: `https://cashcompass-api.onrender.com/api/health`

Should return:
```json
{"status":"ok","message":"CashCompass API is running"}
```

---

## Important Notes

✅ Your repo structure:
```
CashCompass-Frontend&backend/
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   └── models/
└── Frontend/
```

✅ Render will automatically:
- Install npm packages from Backend/package.json
- Run `node server.js`
- Use port 10000 (free tier)

---

## If You Don't See Root Directory Option

Some Render UI versions don't show Root Directory. In that case:

1. Create a **symlink** or move files
2. OR: Deploy without specifying root directory
3. OR: Contact Render support

**Alternative:** You can rename your repo folder structure on GitHub:
- Move Backend files to repo root temporarily
- OR create a separate repo for Backend only
