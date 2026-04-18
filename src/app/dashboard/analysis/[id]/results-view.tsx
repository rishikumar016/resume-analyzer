"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Info,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface AnalysisResultsViewProps {
  analysisId: string;
  overallScore: number;
  scores: {
    relevance: number;
    experience: number;
    skills: number;
    education: number;
    formatting: number;
    impact: number;
  };
  extractedData: {
    name: string;
    email: string | null;
    phone: string | null;
    summary: string;
    skills: Array<{ name: string; category: string; proficiency: string }>;
    experience: Array<{
      company: string;
      role: string;
      duration: string;
      highlights: string[];
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      year: string;
    }>;
  };
  suggestions: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }>;
  jobMatch: {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  } | null;
  jobDescription: string | null;
  fileName: string;
  analyzedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const T = {
  bg: "#f8f9fe",
  surface: "#ffffff",
  surfaceContainer: "#eaeef5",
  surfaceLow: "#f1f4fa",
  primary: "#5056af",
  primaryContainer: "#9298f7",
  onSurface: "#2d333a",
  onSurfaceVariant: "#5a6068",
  outline: "#757b84",
  outlineVariant: "#adb2bb",
  error: "#a8364b",
  errorBg: "rgba(168,54,75,0.08)",
  tertiary: "#974362",
  tertiaryContainer: "#fe97b9",
  success: "#2e7d5b",
  successBg: "rgba(46,125,91,0.08)",
  warning: "#b8860b",
  warningBg: "rgba(184,134,11,0.08)",
  fontHead: "Manrope, var(--font-sans)",
  fontBody: "Inter, var(--font-sans)",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getScoreLabel(s: number) {
  if (s >= 85) return "Strong";
  if (s >= 70) return "Good";
  if (s >= 50) return "Needs Work";
  return "Weak";
}

function getScoreBadgeStyle(s: number) {
  if (s >= 85) return { bg: T.successBg, color: T.success };
  if (s >= 70) return { bg: "rgba(80,86,175,0.1)", color: T.primary };
  if (s >= 50) return { bg: T.warningBg, color: T.warning };
  return { bg: T.errorBg, color: T.error };
}

const TABS = [
  { key: "overview", label: "Tone & Style" },
  { key: "content", label: "Content" },
  { key: "structure", label: "Structure" },
  { key: "skills", label: "Skills" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TAB_SCORE_MAP: Record<TabKey, (keyof AnalysisResultsViewProps["scores"])[]> = {
  overview: ["formatting", "impact"],
  content: ["relevance", "experience"],
  structure: ["formatting", "education"],
  skills: ["skills", "relevance"],
};

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */
export function AnalysisResultsView(props: AnalysisResultsViewProps) {
  const {
    overallScore,
    scores,
    extractedData,
    suggestions,
    jobMatch,
    fileName,
    analyzedAt,
  } = props;

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [checklistOpen, setChecklistOpen] = useState(true);

  const highSuggestion = suggestions.find((s) => s.priority === "high");
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const o = { high: 0, medium: 1, low: 2 };
    return o[a.priority] - o[b.priority];
  });

  const date = new Date(analyzedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const avgTabScore = Math.round(
    TAB_SCORE_MAP[activeTab].reduce((sum, k) => sum + scores[k], 0) /
      TAB_SCORE_MAP[activeTab].length
  );

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: T.bg }}>
      {/* ── HEADER ───────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6"
        style={{ backgroundColor: T.bg }}
      >
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <h1
            className="text-base font-bold tracking-tight sm:text-lg"
            style={{ fontFamily: T.fontHead, color: T.onSurface }}
          >
            Intelligence Dashboard
          </h1>
          <span
            className="hidden rounded-full px-3 py-0.5 text-[11px] font-semibold sm:inline-block"
            style={{ backgroundColor: T.surfaceContainer, color: T.onSurfaceVariant }}
          >
            Active Review
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`,
              color: "#fbf7ff",
            }}
          >
            {extractedData.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="flex-1 px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* ════════════ LEFT COLUMN ════════════ */}
          <div className="flex flex-col gap-6">
            {/* Source Document Card */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: T.surface, boxShadow: "0 20px 40px rgba(45,51,58,0.06)" }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold" style={{ fontFamily: T.fontBody, color: T.onSurface }}>
                  Source Document
                </h2>
              </div>

              {/* Mock resume preview */}
              <div className="rounded-xl p-5" style={{ backgroundColor: T.surfaceLow }}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-24 rounded" style={{ backgroundColor: T.surfaceContainer }} />
                    <div className="h-3 w-16 rounded" style={{ backgroundColor: T.primaryContainer, opacity: 0.4 }} />
                  </div>
                  <div className="h-2 w-32 rounded" style={{ backgroundColor: T.surfaceContainer }} />
                  <div className="space-y-2 pt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex gap-2">
                        <div className="h-2 rounded" style={{ backgroundColor: T.surfaceContainer, width: `${60 + Math.random() * 35}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="h-px" style={{ backgroundColor: T.surfaceContainer }} />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-2">
                        <div className="h-2 rounded" style={{ backgroundColor: T.surfaceContainer, width: `${50 + Math.random() * 40}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-3 truncate text-xs" style={{ color: T.outline, fontFamily: T.fontBody }}>
                {fileName}
              </p>

              <button
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-colors hover:opacity-80"
                style={{ backgroundColor: T.surfaceLow, color: T.primary, fontFamily: T.fontBody }}
              >
                <Download className="h-3.5 w-3.5" />
                Export PDF
              </button>
            </div>
          </div>

          {/* ════════════ RIGHT COLUMN ════════════ */}
          <div className="flex flex-col gap-6">
            {/* ── Aggregate Rating + Quick Fix ── */}
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              {/* Rating Card */}
              <div className="flex items-center gap-5 rounded-2xl p-6" style={{ backgroundColor: T.surfaceLow }}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: T.outline, fontFamily: T.fontBody }}>
                    Aggregate Rating
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tabular-nums" style={{ fontFamily: T.fontHead, color: T.onSurface }}>
                      {overallScore}
                    </span>
                    <span className="text-sm font-medium" style={{ color: T.outline }}>/100</span>
                  </div>
                  <p className="mt-1.5 text-xs" style={{ color: T.onSurfaceVariant, fontFamily: T.fontBody }}>
                    ↗ Top {Math.max(5, 100 - overallScore)}% for {extractedData.experience?.[0]?.role || "this role"}
                  </p>
                </div>
                {/* Donut gauge */}
                <div className="relative ml-auto flex-shrink-0">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" fill="none" stroke={T.surfaceContainer} strokeWidth="6" />
                    <circle
                      cx="36" cy="36" r="30"
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallScore / 100) * 188.5} 188.5`}
                      transform="rotate(-90 36 36)"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={T.tertiary} />
                        <stop offset="100%" stopColor={T.primary} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: T.surfaceContainer }}>
                      <Zap className="h-4 w-4" style={{ color: T.primary }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Fix Card */}
              {highSuggestion && (
                <div className="flex flex-col justify-center rounded-2xl px-5 py-5 sm:w-44" style={{ background: `linear-gradient(135deg, ${T.onSurface}, #3d4450)`, color: "#fbf7ff" }}>
                  <AlertCircle className="mb-2 h-5 w-5 opacity-70" />
                  <p className="text-sm font-bold" style={{ fontFamily: T.fontHead }}>Quick Fix</p>
                  <p className="mt-1 text-[11px] leading-snug opacity-80" style={{ fontFamily: T.fontBody }}>
                    {highSuggestion.description.slice(0, 80)}
                    {highSuggestion.description.length > 80 ? "…" : ""}
                  </p>
                </div>
              )}
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: T.surfaceLow }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                    activeTab === tab.key ? "shadow-sm" : "hover:opacity-70"
                  )}
                  style={{
                    fontFamily: T.fontBody,
                    backgroundColor: activeTab === tab.key ? T.surface : "transparent",
                    color: activeTab === tab.key ? T.primary : T.outline,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Improvement Checklist ── */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: T.surface, boxShadow: "0 20px 40px rgba(45,51,58,0.06)" }}>
              <button
                onClick={() => setChecklistOpen(!checklistOpen)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: T.surfaceLow }}>
                    <CheckCircle2 className="h-4 w-4" style={{ color: T.primary }} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold" style={{ fontFamily: T.fontHead, color: T.onSurface }}>
                      Resume Improvement Checklist
                    </h3>
                    <p className="text-[11px]" style={{ color: T.outline }}>
                      {suggestions.filter((s) => s.priority === "high").length} critical items remaining
                    </p>
                  </div>
                </div>
                {checklistOpen ? (
                  <ChevronUp className="h-4 w-4" style={{ color: T.outline }} />
                ) : (
                  <ChevronDown className="h-4 w-4" style={{ color: T.outline }} />
                )}
              </button>

              {checklistOpen && (
                <div className="mt-5 space-y-3">
                  {sortedSuggestions.slice(0, 4).map((s, i) => {
                    const isCritical = s.priority === "high";
                    const badgeStyle = isCritical
                      ? { bg: T.errorBg, color: T.error, label: "CRITICAL" }
                      : s.priority === "medium"
                        ? { bg: T.warningBg, color: T.warning, label: "ADVISORY" }
                        : { bg: "rgba(80,86,175,0.08)", color: T.primary, label: "INFO" };

                    return (
                      <div key={i} className="flex items-start gap-3 rounded-xl p-4" style={{ backgroundColor: T.surfaceLow }}>
                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: isCritical ? T.errorBg : T.surfaceContainer }}>
                          {isCritical ? (
                            <AlertCircle className="h-3.5 w-3.5" style={{ color: T.error }} />
                          ) : (
                            <Info className="h-3.5 w-3.5" style={{ color: T.outline }} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold" style={{ fontFamily: T.fontBody, color: T.onSurface }}>
                              {s.title}
                            </p>
                            <span className="flex-shrink-0 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color }}>
                              {badgeStyle.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed" style={{ color: T.onSurfaceVariant, fontFamily: T.fontBody }}>
                            {s.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Tone Analysis / Tab Content ── */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: T.surface, boxShadow: "0 20px 40px rgba(45,51,58,0.06)" }}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" style={{ color: T.primary }} />
                  <h3 className="text-sm font-bold" style={{ fontFamily: T.fontHead, color: T.onSurface }}>
                    {TABS.find((t) => t.key === activeTab)?.label} Analysis
                  </h3>
                </div>
                {(() => {
                  const style = getScoreBadgeStyle(avgTabScore);
                  return (
                    <span className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: style.bg, color: style.color }}>
                      {getScoreLabel(avgTabScore)}
                    </span>
                  );
                })()}
              </div>

              {/* Score metric cards */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                {TAB_SCORE_MAP[activeTab].map((scoreKey) => (
                  <div key={scoreKey} className="rounded-xl p-4" style={{ backgroundColor: T.surfaceLow }}>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: T.outline }}>
                      {scoreKey.charAt(0).toUpperCase() + scoreKey.slice(1)}
                    </p>
                    <p className="mt-1 text-lg font-bold" style={{ fontFamily: T.fontHead, color: T.onSurface }}>
                      {scores[scoreKey]}/100
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed" style={{ color: T.onSurfaceVariant, fontFamily: T.fontBody }}>
                {extractedData.summary}
              </p>

              {/* Skills chips for skills tab */}
              {activeTab === "skills" && extractedData.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {extractedData.skills.slice(0, 12).map((skill) => (
                    <span key={skill.name} className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ backgroundColor: T.surfaceLow, color: T.primary }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Job Match (if available) ── */}
            {jobMatch && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: T.surface, boxShadow: "0 20px 40px rgba(45,51,58,0.06)" }}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold" style={{ fontFamily: T.fontHead, color: T.onSurface }}>
                    Job Match Analysis
                  </h3>
                  {(() => {
                    const style = getScoreBadgeStyle(jobMatch.matchPercentage);
                    return (
                      <span className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: style.bg, color: style.color }}>
                        {jobMatch.matchPercentage}% Match
                      </span>
                    );
                  })()}
                </div>

                {/* Match bar */}
                <div className="mb-5 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: T.surfaceContainer }}>
                  <div className="h-full rounded-full" style={{ width: `${jobMatch.matchPercentage}%`, background: `linear-gradient(90deg, ${T.primary}, ${T.primaryContainer})` }} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {jobMatch.matchedSkills.length > 0 && (
                    <div>
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: T.success }}>Matched</p>
                      <div className="flex flex-wrap gap-1">
                        {jobMatch.matchedSkills.map((s) => (
                          <span key={s} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: T.successBg, color: T.success }}>
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {jobMatch.missingSkills.length > 0 && (
                    <div>
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: T.error }}>Missing</p>
                      <div className="flex flex-wrap gap-1">
                        {jobMatch.missingSkills.map((s) => (
                          <span key={s} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: T.errorBg, color: T.error }}>
                            ✗ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-3 px-4 py-4" style={{ backgroundColor: "rgba(248,249,254,0.85)", backdropFilter: "blur(12px)" }}>
        <Link
          href="/dashboard/history"
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: T.surface, color: T.onSurface, fontFamily: T.fontBody, boxShadow: "0 2px 8px rgba(45,51,58,0.08)" }}
        >
          <FileText className="h-3.5 w-3.5" />
          View Previous Versions
        </Link>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold transition-all hover:shadow-lg hover:shadow-[#5056af]/20"
          style={{ background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`, color: "#fbf7ff", fontFamily: T.fontBody }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Analyze New Resume
        </Link>
      </div>
    </div>
  );
}
