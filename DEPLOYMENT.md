# Stock Trading App - Deployment Guide

## Architecture
- **Frontend**: React app deployed on Vercel
- **Backend**: Express.js API deployed on Render
- **Database**: MongoDB Atlas

## Deployment Steps

### 1. Backend Deployment (Render)

1. Go to [render.com](https://render.com) and create account
2. Connect your GitHub repository
3. Create new **Web Service**
4. Configure:
   ```
   Name: stock-trading-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Root Directory: server
   ```

5. Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://stock:stock123@cluster0.xeftctz.mongodb.net/?appName=Cluster0
   JWT_SECRET=naresh
   TIINGO_API_KEY=589202fd0dc60899ced62caed821a460f8e52d22
   STOCK_API_KEY=d1utvp1r01qgfa770ni0d1utvp1r01qgfa770nig
   GEMINI_API_KEY=AIzaSyCIl11dofwv2yUB44xF5J08eiHmLUOqRog
   NODE_ENV=production
   PORT=10000
   ```

6. Deploy - You'll get URL: `https://stock-trading-backend.onrender.com`

### 2. Frontend Deployment (Vercel)

1. Your frontend is already on Vercel
2. Add Environment Variable in Vercel Dashboard:
   ```
   REACT_APP_API_URL=https://stock-trading-backend.onrender.com
   ```
3. Redeploy

### 3. Update Backend CORS

Update `server/server.js` CORS configuration to include your frontend URL:
```javascript
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://stock-trading-mern-app.vercel.app"
  ],
  credentials: true
}));
```

## Testing

### API Endpoints
- Register: `POST https://stock-trading-backend.onrender.com/api/auth/register`
- Login: `POST https://stock-trading-backend.onrender.com/api/auth/login`
- Portfolio: `GET https://stock-trading-backend.onrender.com/api/stock/adduser/:id`

### Frontend
- Production: `https://stock-trading-mern-app.vercel.app`
- Local: `http://localhost:3000`

## Troubleshooting

### 405 Method Not Allowed
- Ensure backend is deployed on Render (not Vercel)
- Check CORS configuration
- Verify API routes are properly defined

### CORS Errors
- Add frontend URL to CORS origins
- Ensure credentials: true is set

### Environment Variables
- Double-check all env vars are set in Render
- Verify REACT_APP_API_URL in Vercel