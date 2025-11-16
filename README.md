## _AgriConnect: A Streamlined System for Farmers' Resource Integration at the Farmers' Information and Technology Services (FITS) Center in Tanza, Cavite_

- Chat module ( Resolved/Ongoing/Unread )
- Analytics ( Transactions/Satisfactory )( Report Form )
- EIC item ( Available/Borrowed) (EIC [ Distributed | Digitize | Develop ] CRUD )
- Form ( Registration/Login )
- Enrollment ( Training & Seminars )
- Dashboard ( Client Profiling - Type Filtering )
- Satisfactory Evaluation Form ( For every transaction )

---

## 🚀 Deployment Guide

### Development Setup
1. **Install dependencies:**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Run in development mode:**
   ```bash
   # Terminal 1: Start server (from server directory)
   cd server
   npm run dev
   
   # Terminal 2: Start client (from client directory)
   cd client
   npm run dev
   ```

### Production Build & Deployment

The app now uses **static file serving** for better performance:

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   # or
   npm run build:deploy
   ```
   This builds the React app into `server/public/app/` directory.

2. **Start the production server:**
   ```bash
   cd server
   npm start
   # or for development with auto-reload
   npm run dev
   ```

3. **How it works:**
   - React app is built as static files (HTML, CSS, JS)
   - Static files are served from `server/public/app/`
   - Browser loads all assets once (cached on client-side)
   - API routes (`/api/*`, `/auth/*`) are handled by Express
   - Client-side routing handled by React Router
   - **Much faster** than server-side rendering on free hosting!

### Deployment Checklist
- [ ] Build React app: `npm run build` in client folder
- [ ] Ensure `server/public/app/` contains the built files
- [ ] Set environment variables in server `.env`
- [ ] Start server: `npm start` in server folder
- [ ] Access app at your server URL (e.g., `http://yourserver.com`)

### Benefits of This Setup
✅ **Faster initial load** - All assets cached on client
✅ **Reduced server load** - No rendering on each request
✅ **Better for free hosting** - Minimal server resources needed
✅ **SEO-friendly fallback** - Can add meta tags in index.html
✅ **Production-ready** - Code splitting and optimization built-in

