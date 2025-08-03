// FILE: src/components/pages/home/TechStackShowcase.tsx

"use client";

import React from "react";
import {
  SiNextdotjs,
  SiTypescript,
  SiPrisma,
  SiPostgresql,
  SiExpress,
  SiTailwindcss,
  SiReactquery,
  SiNextra,
  SiJsonwebtokens,
  SiMailgun,
  SiZod,
  SiPnpm,
} from "react-icons/si";

// A reusable component for each tech icon
const TechIcon = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <div className="flex items-center gap-4 rounded-lg bg-card p-4 transition-colors hover:bg-muted/80">
    <Icon className="h-8 w-8" style={{ color }} />
    <span className="text-lg font-semibold text-card-foreground">{label}</span>
  </div>
);

export default function TechStackShowcase() {
  return (
    <div className="mt-24 md:mt-32">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Powered by a Modern, Robust Stack
        </h2>
        <p className="mt-4 text-muted-foreground">
          Built with industry-leading technologies you can trust and love.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Tech Stack Icons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <TechIcon icon={SiNextdotjs} label="Next.js" color="#FFFFFF" />
          <TechIcon icon={SiTypescript} label="TypeScript" color="#3178C6" />
          <TechIcon icon={SiPrisma} label="Prisma" color="#2D3748" />
          <TechIcon icon={SiPostgresql} label="PostgreSQL" color="#4169E1" />
          <TechIcon icon={SiExpress} label="Express.js" color="#000000" />
          <TechIcon icon={SiTailwindcss} label="Tailwind CSS" color="#06B6D4" />
          <TechIcon icon={SiReactquery} label="RTK Query" color="#FF4154" />
          <TechIcon icon={SiNextra} label="NextAuth.js" color="#8B5CF6" />
          <TechIcon
            icon={SiJsonwebtokens}
            label="JWT Security"
            color="#000000"
          />
          <TechIcon icon={SiMailgun} label="Mailgun" color="#EF3434" />
          <TechIcon icon={SiZod} label="Zod" color="#3E67B1" />
          <TechIcon icon={SiPnpm} label="PNPM" color="#F69220" />
        </div>

        {/* Right Side: Browser Mockup */}
        <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
          {/* Browser Header */}
          <div className="flex items-center gap-2 bg-muted px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm bg-background/50">
            <div className="flex gap-2">
              <span className="text-muted-foreground">$</span>
              <p>git clone https://github.com/biooids/your-repo</p>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="text-muted-foreground">$</span>
              <p>cd your-repo</p>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="text-muted-foreground">$</span>
              <p>pnpm install</p>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="text-muted-foreground">$</span>
              <p>pnpm run dev</p>
            </div>
            <div className="flex gap-2 mt-8">
              <span className="text-green-400">✓</span>
              <p>
                <span className="text-primary font-semibold">Ready!</span> Your
                app is running at http://localhost:3000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
