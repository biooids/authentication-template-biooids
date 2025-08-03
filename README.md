# Authentication Starter Template

This repository is a full-stack authentication starter template designed for building SaaS applications. It uses Next.js on the front-end and Express with TypeScript on the back-end, supported by Prisma ORM connected to PostgreSQL.

## Features

### Backend (Express Server)
- **Node.js** and **Express 5**
- **TypeScript** for static type checking
- **Prisma ORM** with PostgreSQL
- **JWT-based Authentication** (Access and Refresh tokens)
- **Password Reset** and **Email Verification**
- **Rate Limiting** for security
- **Cloudinary** for file storage
- **Mailgun Integration** for sending emails
- Structured for **user management**, **admin features**, **marketing emails**, and **settings**.

### Frontend (Next.js 15)
- **Next.js** with **React 19**
- **TypeScript** for type safety
- **NextAuth.js** for authentication
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Radix UI** components
- **TipTap** for rich text editing

## Installation

Clone the repository and navigate to the project directory.

### Server
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file based on the `.env.example` and configure your environment variables.
4. Run Prisma migrations:
   ```bash
   pnpm prisma:migrate
   ```
5. Start the server:
   ```bash
   pnpm dev
   ```

### Client
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file based on the `.env.example` and configure your environment variables.
4. Start the client:
   ```bash
   pnpm dev
   ```

## Security Notice
- Ensure that sensitive credentials in `.env` files are properly secured. Do not commit them to version control.
- Rotate secrets and API keys as necessary.

## License
This project is licensed under **ISC**.
