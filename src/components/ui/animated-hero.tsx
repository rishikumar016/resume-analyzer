"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Sparkles, BarChart3, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Hero({ onGetStarted }: { onGetStarted?: () => void }) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["analyzed", "optimized", "perfected", "polished", "improved"],
    []
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
    <div className="w-full">
      <div className="container mx-auto">
        {/* Hero */}
        <div className="flex gap-6 py-16 lg:py-28 items-center justify-center flex-col">
          <Badge variant="outline" className="gap-2 px-3 py-1 text-xs font-medium border-primary/30 text-primary">
            <Sparkles className="w-3 h-3" />
            AI-powered resume analysis
          </Badge>

          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-4xl md:text-6xl max-w-2xl tracking-tight text-center font-semibold leading-tight">
              <span>Tailor resume,</span>
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
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
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

          <Button size="lg" className="gap-2 mt-2" onClick={onGetStarted}>
            Get started <MoveRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Feature pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pb-16">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Resume scoring</p>
              <p className="text-xs text-muted-foreground">Detailed breakdown across key areas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary/40">
              <Sparkles className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Skill extraction</p>
              <p className="text-xs text-muted-foreground">Auto-detect technical & soft skills</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent">
              <Lightbulb className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Smart suggestions</p>
              <p className="text-xs text-muted-foreground">Tailored tips to improve your resume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
