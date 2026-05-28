# DevEvents

A developer event discovery and booking platform built with **Next.js**, **Prisma**, and **PostgreSQL**.

## Features

- Browse developer events (conferences, meetups, hackathons)
- Events available in online, offline, and hybrid modes
- Book events with your email
- Clean, responsive UI built with Next.js App Router
- Slug-based event detail pages

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Language:** TypeScript
- **Styling:** Tailwind CSS / shadcn UI

## Getting Started

```bash
# Install dependencies
npm install

# Set up your database
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma migrate dev

# Start development server
npm run dev
```

## Project Structure

```
devevents/
├── app/          # Next.js App Router pages and layouts
├── lib/          # Utility functions and shared logic
├── prisma/       # Database schema and migrations
└── public/       # Static assets
```

## Database Schema

- **Event** — title, description, date, time, mode (online/offline/hybrid), venue, location, tags, organizer
- **Booking** — connects users (by email) to events
