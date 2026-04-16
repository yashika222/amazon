# Amazon Clone

A complete full stack production-ready E-commerce application resembling Amazon.

## Architecture & Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Prisma ORM)

## Overview of Features

- **Product Listing Page**: Grid layout of products, Amazon-styled headers, Hero banner.
- **Product Detail Page**: Image selectors, mock reviews, dynamically computed prices, "Add to Cart" and "Buy Now" functionalities.
- **Cart API & UI**: Add, update quantities (up to 10), remove from cart. Live subtotal calculation.
- **Checkout & Order Mock**: Fully functioning order generation backend, saves checkout address to Postgres DB.

## Prerequisites
- Node.js v20+
- PostgreSQL database (or an equivalent URI via Supabase or Railway)
- NPM

---

## 🚀 Setup Instructions (Local)

### 1. Database & Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Environment Variables. Open `backend/.env` and update the `DATABASE_URL` string to your Postgres DB connection string. 
4. Sync the database schema and generate Prisma client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Seed the database with the pre-populated 20 product catalog:
   ```bash
   npm run prisma:seed    # Uses node prisma/seed.js
   ```
6. Start the API server:
   ```bash
   npm run dev
   ```
   *The server will run on port 5000.*

### 2. Frontend Setup
1. Open a NEW terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The client will run on port 3000.*

Navigate to `http://localhost:3000` to interact with your Amazon Clone!

---

## 🌍 Deployment Guide

### Deploying the Backend (Render or Railway)
1. Commit this entire repository to GitHub.
2. Go to [Render](https://render.com/) or [Railway](https://railway.app/).
3. Create a new **Web Service**.
4. Select your repository. Use `/backend` as the Root Directory.
5. Set the Build Command to: `npm install && npx prisma generate && npx prisma db push` (Ensure the DB is deployed before).
6. Set the Start Command to: `npm start` (or `node index.js`).
7. **Environment Variables**: Add your `DATABASE_URL`, and optionally a `PORT`.

### Deploying the Database
The easiest way to get a quick PostgreSQL database is using **Railway** natively or via **Supabase**. They give you a connection string like `postgresql://postgres:password@host:5432/postgres`. Add this to the backend `.env` variables.

### Deploying the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/).
2. Create a **New Project** and select this repository.
3. Select `frontend` as the **Root Directory**.
4. Framework Preset will automatically be detected as `Next.js`.
5. Under **Environment Variables**, if your backend URL changed from `localhost:5000`, you should ideally extract it to a `NEXT_PUBLIC_API_URL` variable (for this clone, `localhost:5000` is hardcoded for simplicity). If deploying, update the `axios` strings in `page.tsx`, `ProductCard.tsx` to point to your deployed Render URL.
6. Click **Deploy**.

## Final Words
Enjoy your Amazon clone. The default cart persists to the `default@amazon.com` user profile!
