# Handmade Mortar & Pestle Store

A responsive e-commerce website for a handmade mortar and pestle business, built as a
MERN-stack portfolio project. See `CLAUDE.md` for the full tech spec and `DESIGN.md`
for the design system.

## Tech Stack
- **Client**: React (Vite), TypeScript, Tailwind CSS
- **Server**: Node.js, Express, TypeScript
- **Database**: MongoDB (Atlas) via Mongoose
- **Payments**: Stripe Checkout
- **Images**: Cloudinary

## Project Structure
```
client/   React frontend
server/   Express API
```

## Setup

### Prerequisites
- Node.js 20+
- A MongoDB Atlas cluster (free tier is fine) and its connection string

### Server
```
cd server
cp .env.example .env   # fill in MONGO_URI with your Atlas connection string
npm install
npm run dev             # http://localhost:5000
```

### Client
```
cd client
cp .env.example .env
npm install
npm run dev             # http://localhost:5173
```

The client dev server proxies `/api` requests to `http://localhost:5000`, so both
should be running together during development.

## Status
Work in progress, built incrementally in scoped segments. Screenshots and a live
demo link will be added once the MVP is deployed.
