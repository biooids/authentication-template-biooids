// FILE: src/components/pages/about/About.tsx

"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Mail,
  Users,
  Code,
  Rocket,
  Wrench,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Reusable component for each grid item to keep the code clean
const BentoGridItem = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "group relative flex flex-col justify-between rounded-xl border border-[--border] bg-[--card] p-6 shadow-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10",
      className
    )}
  >
    {children}
  </div>
);

export default function About() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            The Ultimate Launchpad
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            This isn't just a starter kit. It's a professional-grade foundation,
            meticulously engineered to help you build and launch your next big
            idea, faster than ever.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[20rem]">
          {/* Main Feature: Secure Auth */}
          <BentoGridItem className="md:col-span-2 lg:col-span-2">
            <ShieldCheck className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">
              Production-Ready Security
            </h2>
            <p className="text-muted-foreground mt-2">
              Built with a secure-by-default mindset, featuring JWTs, refresh
              token rotation, social logins, and secure cookie handling.
            </p>
          </BentoGridItem>

          {/* Admin Panel */}
          <BentoGridItem>
            <Users className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold text-foreground">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground mt-2">
              Manage users and monitor your platform from a built-in,
              role-protected admin panel.
            </p>
          </BentoGridItem>

          {/* Marketing Suite */}
          <BentoGridItem>
            <Mail className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold text-foreground">
              Marketing Suite
            </h2>
            <p className="text-muted-foreground mt-2">
              Engage your users with a complete CRUD system for sending
              beautiful, branded newsletters.
            </p>
          </BentoGridItem>

          {/* Creator Spotlight */}
          <BentoGridItem className="md:col-span-2 lg:col-span-2 row-span-2 relative overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="https://res.cloudinary.com/djtww0vax/image/upload/v1747766773/xi-biooid_bstapi.jpg"
                alt="Creator's Image"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-20"
              />
            </div>
            <div className="relative z-10 flex flex-col justify-end h-full">
              <Heart className="h-8 w-8 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold text-foreground">
                Crafted with Passion
              </h2>
              <p className="text-muted-foreground mt-2">
                "I built this starter because I believe great ideas deserve a
                great start. This is the foundation I wish I had—secure,
                scalable, and ready for you to make it your own."
              </p>
              <p className="text-foreground font-semibold mt-4">- biooids</p>
            </div>
          </BentoGridItem>

          {/* Tech Stack */}
          <BentoGridItem className="lg:col-span-2">
            <Code className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold text-foreground">
              Modern Tech Stack
            </h2>
            <p className="text-muted-foreground mt-2">
              Leveraging the power of Next.js, TypeScript, Prisma, PostgreSQL,
              and Tailwind CSS for a robust and enjoyable developer experience.
            </p>
          </BentoGridItem>

          {/* The DIY Philosophy */}
          <BentoGridItem className="md:col-span-1 lg:col-span-2">
            <Wrench className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">
              The "Do It Yourself" Core
            </h2>
            <p className="text-muted-foreground mt-2">
              This is your foundation, not a finished product. We provide the
              secure, complex boilerplate so you can focus on what truly
              matters: building the unique features that bring your vision to
              life.
            </p>
          </BentoGridItem>
        </div>
      </div>
    </div>
  );
}
