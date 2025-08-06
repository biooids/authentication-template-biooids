# Full-Stack Starter Kit: Next.js & Express

Tired of rebuilding authentication and user systems from scratch? This is a complete, production-ready, full-stack starter kit designed to save you weeks of setup. It provides a robust and secure foundation for any modern web application, allowing you to focus on what truly matters: your features.

> Proudly crafted by **biooids**

---

## ✨ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Radix UI
- **Backend**: Express 5, TypeScript, Prisma, PostgreSQL
- **Authentication**: JWT, NextAuth.js (Google, GitHub, etc.)
- **Real-time**: WebSockets with Socket.IO
- **Storage**: Cloudinary
- **Email**: Mailgun
- **Dev Tools**: pnpm, Docker, Redux Toolkit, RTK Query, TipTap Editor

---

## 🚀 Core Features

### 🔧 Backend (Express & Prisma)

- ✅ **Modern Stack**: Node.js + Express 5 + TypeScript
- ✅ **Database**: Prisma ORM with PostgreSQL
- ✅ **Auth System**: Access/refresh token JWT auth
- ✅ **Complete Auth Flow**: Password reset, email verification, social login (Google, GitHub)
- ✅ **Follow System**: Built-in follow/unfollow
- ✅ **Real-time Engine**: Live updates with WebSocket (Socket.IO)
- ✅ **Admin Panel**: Role-based, marketing email CRUD, user management
- ✅ **User Settings**: Preferences for theme, email, notifications
- ✅ **Production Ready**: Secure cookies, rate limiting, Mailgun, Cloudinary

### 🖥️ Frontend (Next.js & Redux)

- ✅ **React 19 + Next.js 15** (App Router)
- ✅ **Redux Toolkit + RTK Query**: Fast, scalable state & API management
- ✅ **NextAuth.js**: Full frontend-backend session sync
- ✅ **Live Notifications**: WebSocket-powered toast & bell icon alerts
- ✅ **Tailwind + Radix UI**: Elegant, accessible UI design
- ✅ **TipTap Rich Editor**: Admin-side content and marketing editor

---

## 📦 Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) _(optional for running PostgreSQL easily)_

---

## 🛠️ Getting Started

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

1. **Create `.env` file** using `.env.example` as a guide
2. **Run DB migrations** to set up tables:

```bash
pnpm prisma migrate dev
```

3. **Start the backend server**

```bash
pnpm dev
```

> Backend runs at: `http://localhost:3001`

---

### 3. Frontend Setup (`/client`)

```bash
cd ../client
pnpm install
```

1. **Create `.env` file** using `.env.example`
2. **Start the frontend**

```bash
pnpm dev
```

> Frontend runs at: `http://localhost:3000`

---

## 🚀 Making This Repository Your Own

### 🔖 Add Badges

```markdown
![GitHub License](https://img.shields.io/github/license/biooids/authentication-template-biooids)
![GitHub Stars](https://img.shields.io/github/stars/biooids/authentication-template-biooids)
![GitHub Issues](https://img.shields.io/github/issues/biooids/authentication-template-biooids)
```

### 📄 Choose a License

By default, this project uses the **ISC License**. You can switch to:

- **MIT**
- **Apache 2.0**
- **GPL-3.0**

Just create a `LICENSE` file in your project root.

### 🙌 Contribution Guidelines

If you want open-source contributions, add a `CONTRIBUTING.md` file with:

- Fork & clone instructions
- Issue/bug report process
- Pull request rules

---

## 🔐 Security Notice

- ❗ **Never commit `.env` files** or any secrets
- 🔐 Use strong secrets for JWT, OAuth, session cookies
- 🔄 Rotate your API keys regularly
- ✅ Enable rate limiting and CORS in production

---

## 🙏 Acknowledgments

Thanks to the tools and frameworks powering this project:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Socket.IO](https://socket.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TipTap](https://tiptap.dev/)
- [Mailgun](https://www.mailgun.com/)
- [Cloudinary](https://cloudinary.com/)

---

## 📬 Questions or Support?

Need help?  
Open an issue at: [GitHub Issues](https://github.com/biooids/authentication-template-biooids/issues)

---

**Happy hacking! 🚀**
