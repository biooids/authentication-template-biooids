"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Github,
  ShieldCheck,
  Users,
  Mail,
  Code,
  Wrench,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// A reusable card component for the feature grid
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-lg border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1",
      className
    )}
  >
    <Icon className="h-8 w-8 text-primary mb-4" />
    <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </div>
);

export default function HeroSection() {
  return (
    <section className="bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter">
              Launch Your Next App on a{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Solid Foundation
              </span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground">
              This isn't just a template. It's a complete, production-ready
              starter kit designed to save you weeks of setup. Focus on your
              features, not the boilerplate.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/auth/signup">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="https://github.com/biooids"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 blur-3xl"></div>
              <Image
                src="https://res.cloudinary.com/djtww0vax/image/upload/v1747766773/xi-biooid_bstapi.jpg"
                alt="Creator Avatar"
                width={400}
                height={400}
                className="relative rounded-full border-4 border-background shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 md:mt-32">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything You Need, Out of the Box
            </h2>
            <p className="mt-4 text-muted-foreground">
              A curated collection of features to build a modern, scalable web
              application.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={ShieldCheck}
              title="Secure Authentication"
              description="Full auth system with credentials, social logins (Google/GitHub), and secure token rotation."
            />
            <FeatureCard
              icon={Users}
              title="Admin Dashboard"
              description="A protected area to manage users and view platform statistics, with role-based access control."
            />
            <FeatureCard
              icon={Mail}
              title="Marketing & Email"
              description="Send beautiful, branded newsletters and transactional emails with a complete backend management system."
            />
            <FeatureCard
              icon={Code}
              title="Modern Tech Stack"
              description="Built with Next.js, Express, Prisma, and TypeScript for a powerful and type-safe developer experience."
            />
            <FeatureCard
              icon={Wrench}
              title="The DIY Philosophy"
              description="We handle the complex boilerplate. You focus on building the unique features that make your app special."
            />
            <FeatureCard
              icon={Heart}
              title="Crafted with Care"
              description="Designed to be clean, maintainable, and easy to extend. A foundation you can trust and build upon."
            />
          </div>
        </div>
      </div>

      {/* Creator Footer */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            Proudly crafted by{" "}
            <a
              href="https://www.biooids.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              biooids
            </a>
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a
              href="https://www.biooids.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Website
            </a>
            <a
              href="https://github.com/biooids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
