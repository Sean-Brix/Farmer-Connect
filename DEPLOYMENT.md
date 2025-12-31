# Deployment Configuration

## Environment Variables

### Client (.env.production)

Update `client/.env.production` with your deployed backend URL:

```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

**Important:** Replace `your-backend-app` with your actual Render backend service name.

### Server

The server needs the following environment variables on Render:

```env
DATABASE_URL=your-database-connection-string
PORT=8080
NODE_ENV=production
JWT_SECRET=your-jwt-secret
APP_URL=https://farmer-connect.onrender.com
```

## Render Deployment Steps

### Backend (Server)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start`
4. Add environment variables from `.env`
5. Deploy

### Frontend (Client)

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-app.onrender.com/api`
5. Deploy

## CORS Configuration

The server is configured to allow requests from:
- `http://localhost:5173` (development)
- `https://farmer-connect.onrender.com` (production)
- Any URL set in `APP_URL` environment variable

If you change your frontend URL, update the `allowedOrigins` array in `server/config/app.js`.

## Troubleshooting

### CORS Errors

If you see CORS errors like:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

Check:
1. The frontend is using the correct API URL (not localhost)
2. The backend CORS configuration includes your frontend URL
3. Environment variables are set correctly on Render

### 401 Unauthorized

If you see 401 errors, check:
1. Authentication tokens are being sent correctly
2. Cookie settings allow cross-origin cookies
3. JWT_SECRET is set on the server
