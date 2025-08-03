# Full-Stack Authentication Starter Kit

Welcome to the ultimate launchpad for your next great idea. This is a complete, production-ready, full-stack starter kit designed to save you weeks of setup and boilerplate. It provides a robust and secure foundation for any modern web application, allowing you to focus on what truly matters: your features.

> Proudly crafted by **biooids**.

---

## 🚀 Core Features

This project is meticulously engineered with a comprehensive feature set, ensuring you have everything you need right out of the box.

### 🔧 Backend (Express & Prisma)

- **Modern Stack**: Built with Node.js, Express 5, and TypeScript.
- **Powerful ORM**: Integrated with Prisma and PostgreSQL for type-safe database access.
- **Secure Authentication**: JWT-based system with secure access & refresh token rotation.
- **Complete Auth Flow**: Includes password reset, email verification, and social logins (Google/GitHub).
- **Admin & Marketing**: Role-based admin panel with full CRUD for marketing emails.
- **User Control**: Theme & notification preferences in a user settings module.
- **Production Ready**: Rate limiting, secure cookie handling, Cloudinary for file storage, Mailgun for email delivery.

### 🖥️ Frontend (Next.js & Redux)

- **Latest Tech**: Built with Next.js 15 (App Router) and React 19.
- **State Management**: Redux Toolkit + RTK Query for efficient data handling.
- **Seamless Auth**: NextAuth.js client-side auth, fully synced with backend.
- **Beautiful UI**: Tailwind CSS + accessible Radix UI components.
- **Rich Content**: TipTap rich text editor for marketing content.

---

## 📦 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) _(recommended for PostgreSQL)_

---

## 🛠️ Getting Started

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/biooids/authentication-template-biooids.git
cd authentication-template-biooids
```

---

### 2. Backend Setup (`/server`)

```bash
cd server
pnpm install
```

#### Configure Environment Variables

Create a `.env` file inside `/server` and fill it as follows:

```env
# --- Database ---
DATABASE_URL="postgresql://youruser:yourpassword@localhost:5432/auth_db"

# --- Server ---
PORT=3001
NODE_ENV="development"

# --- CORS ---
CORS_ORIGIN="http://localhost:3000"

# --- Cloudinary ---
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# --- JWT ---
ACCESS_TOKEN_SECRET="your_strong_access_token_secret_at_least_32_chars"
ACCESS_TOKEN_EXPIRES_IN_SECONDS="900"
REFRESH_TOKEN_SECRET="your_DIFFERENT_strong_refresh_token_secret_at_least_32_chars"
REFRESH_TOKEN_EXPIRES_IN_DAYS="7"

# --- Mailgun & Frontend URL ---
MAILGUN_API_KEY="your_mailgun_api_key"
MAILGUN_DOMAIN="your_mailgun_domain"
FRONTEND_URL="http://localhost:3000"
```

#### Run Migrations

```bash
pnpm prisma migrate dev
```

#### Start Backend Server

```bash
pnpm dev
```

Backend should now be live at [http://localhost:3001](http://localhost:3001).

---

### 3. Frontend Setup (`/client`)

```bash
cd ../client
pnpm install
```

#### Configure Environment Variables

Create a `.env` file inside `/client`:

```env
# --- NextAuth.js ---
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your_strong_random_nextauth_secret"

# --- Backend API ---
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001/api/v1

# --- OAuth Providers (Optional) ---
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

#### Start Frontend

```bash
pnpm dev
```

Frontend should now be live at [http://localhost:3000](http://localhost:3000).

---

## 🔐 Security Notice

- Never commit `.env` files to version control.
- Rotate API keys and secrets regularly.
- Use strong, unique secrets for JWT and OAuth.

---

## 📄 License

This project is licensed under the **ISC License**.

---

Let me know if you want a `LICENSE`, `CONTRIBUTING.md`, or badge icons added (e.g., build status, license, etc).
