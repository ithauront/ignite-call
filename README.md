# 📅 Ignite Call — Fullstack Scheduling App

A fullstack scheduling application built with **Next.js**, designed to simplify appointment scheduling by integrating seamlessly with **Google Calendar**. This project allows users to authenticate via Google, see their calendar availability, and receive new meeting invitations, while preventing double-bookings and past-dated appointments.

## 🔗 Live Demo

You can try the live app here:  
[ignite-call](https://ignite-call-six-wheat.vercel.app)


## 🔐 Authentication (Google OAuth)

This project uses **NextAuth** to enable authentication via Google. The app requests access to the user's calendar to allow scheduling. The OAuth app is registered and deployed in test mode.

### 🧪 Test Account

**The app is published on Google Cloud in test mode.**
**Only users added to the OAuth test list can authenticate unless using the test account below:**

- **Email**: `testignitecalltest@gmail.com`  
- **Password**: `testignite12call3`

> ⚠️ Please use this only for demo purposes. Do not store any private or sensitive information in this account.

---

## ✨ Features

- 🔒 Google OAuth 2.0 login via **NextAuth**
- 📆 Integration with **Google Calendar API**
- ⛔️ Dates in the past are disabled for scheduling
- ✅ See availability of each user before booking
- 📤 Automatically adds new events to Google Calendar
- 📦 Deployed with **Vercel**

---

## 🧬 Concepts

This application applies and demonstrates several important concepts:

- **Dynamic routing** using `/schedule/[username]` to access each user's public calendar.
- **Backend logic** for checking past dates, blocked days, and user-defined availability intervals. All centralized in the same monorepo, thanks to Next.js API routes.
- **Automatic token refresh**, ensuring long-term access to the user's Google Calendar.
- **SEO configuration** with `next-seo` and `DefaultSeo` to improve discoverability and metadata control.




## 🛠️ Tech Stack

- **Next.js** 
- **TypeScript**
- **Stitches** 
- **NextAuth** 
- **Google APIs** 
- **React Hook Form** + **Zod** 
- **React Query (TanStack)**
- **Prisma**
- **Axios**
- **Day.js** 
- **Phosphor Icons** 
- **Next-Seo**
- **Nookies**

---

## ▶️ Getting Started

To run the project locally:

```bash
# Clone the repo
git clone https://github.com/ithauront/ignite-call.git

# Install dependencies
pnpm install
```

Create your own .env.local file with the following variables:

```bash
DATABASE_URL=
DATABASE_DIRECT_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
```
You can follow [this guide](https://next-auth.js.org/getting-started/introduction) to create your own Google OAuth credentials.  


# Run the development server
```bash
pnpm dev
```

## 📚 What I Learned

- How to integrate Google OAuth 2.0 in a Next.js app

- Registering and configuring a project on Google Cloud Console

- Requesting access to the Google Calendar API

- Using NextAuth for server-side session management

- Working with Prisma ORM and running database migrations

- Creating backend business logic with Prisma for time availability, scheduling, and blocked dates

- Styling with Stitches and building responsive UI components

- Deploying a full-stack Next.js app on Vercel

- Building dynamic routes with Next.js

- Using React Query to handle data fetching, caching, and automatic revalidation

- Implementing SEO using `next-seo` and the `DefaultSeo` component













