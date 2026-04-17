"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MoveRight,
  Sparkles,
  BarChart3,
  Lightbulb,
  FileSearch,
  Target,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingPage() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["analyzed", "optimized", "perfected", "polished", "improved"],
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold tracking-tight">
              Resume Analyzer
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-6 py-20 lg:py-32">
          <Badge
            variant="outline"
            className="gap-2 px-3 py-1 text-xs font-medium border-primary/30 text-primary"
          >
            <Sparkles className="w-3 h-3" />
            AI-powered resume intelligence
          </Badge>

          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl md:text-6xl max-w-2xl tracking-tight text-center font-semibold leading-tight">
              <span>Your resume,</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold text-primary"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-lg text-center">
              Get an instant score, skill extraction, and actionable suggestions
              to land your dream job.
            </p>
          </div>

          <div className="flex gap-3 mt-2">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/sign-up">
                Start for free <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
              Everything you need to stand out
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our AI digs deep into your resume and gives you a competitive edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: BarChart3,
                title: "Resume scoring",
                desc: "Get a detailed breakdown across relevance, experience, skills, education, formatting, and impact.",
              },
              {
                icon: Sparkles,
                title: "Skill extraction",
                desc: "Auto-detect technical, soft, tools, and language skills with proficiency levels.",
              },
              {
                icon: Lightbulb,
                title: "Smart suggestions",
                desc: "Receive prioritized, actionable tips to improve your resume's effectiveness.",
              },
              {
                icon: Target,
                title: "Job match analysis",
                desc: "Paste a job description and see exactly how well you match — plus what's missing.",
              },
              {
                icon: Shield,
                title: "Private & secure",
                desc: "Your resume data is processed securely and never shared with third parties.",
              },
              {
                icon: Zap,
                title: "Instant results",
                desc: "Powered by GPT — get comprehensive analysis in under 30 seconds.",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="flex items-start gap-4 rounded-lg border bg-card p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{feat.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Three simple steps to a better resume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            {
              step: "1",
              title: "Upload your resume",
              desc: "Drag & drop your PDF and optionally add a job description.",
            },
            {
              step: "2",
              title: "AI analyzes it",
              desc: "Our AI scores, extracts skills, and identifies improvements.",
            },
            {
              step: "3",
              title: "Get actionable results",
              desc: "Review your score, suggestions, and job-match breakdown.",
            },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                {s.step}
              </div>
              <h3 className="text-sm font-semibold">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t bg-primary/5">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            Ready to improve your resume?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join thousands of job-seekers who landed interviews with our AI
            analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/sign-up">
                Create free account <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileSearch className="h-3.5 w-3.5" />
            Resume Analyzer
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
