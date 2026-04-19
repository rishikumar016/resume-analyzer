import { FeatureCard } from "./FeatureCard";
import {
  Upload,
  Sparkles,
  Edit,
  Eye,
  Layout,
  Download,
  Save,
  Zap,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

export function FeaturesShowcase() {
  const features = [
    {
      icon: Upload,
      title: "PDF Upload",
      description: "Upload your resume as PDF and get instant AI analysis",
      badge: "Start Here",
      badgeVariant: "default" as const,
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "AI examines your resume across relevance, experience, skills, and formatting",
      badge: "Smart",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Edit,
      title: "Full Editing",
      description: "Edit every section - basics, work, education, and skills with auto-save",
      badge: "Complete",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Eye,
      title: "Live Preview",
      description: "See changes instantly as you edit with real-time preview",
      badge: "Real-time",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Layout,
      title: "3 Templates",
      description: "Modern, ATS-Friendly, and Creative templates with one-click switching",
      badge: "Flexible",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Download,
      title: "Export PDF",
      description: "Download your resume as PDF in any template style directly from browser",
      badge: "Ready",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Save,
      title: "Auto-Save",
      description: "All changes automatically saved to database - never lose your work",
      badge: "Safe",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Lightbulb,
      title: "AI Suggestions",
      description: "Get contextual improvement suggestions for each resume section",
      badge: "Helpful",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Zap,
      title: "Quick Apply",
      description: "Apply AI suggestions with a single click directly to your resume",
      badge: "Fast",
      badgeVariant: "secondary" as const,
    },
    {
      icon: CheckCircle2,
      title: "Scoring System",
      description: "Detailed scoring across 6 dimensions to understand resume strength",
      badge: "Insights",
      badgeVariant: "secondary" as const,
    },
    {
      icon: RefreshCw,
      title: "Template Switching",
      description: "Switch templates without losing any data - templates are just rendering",
      badge: "Smart",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Upload,
      title: "Job Matching",
      description: "Optional job description analysis to match skills and identify gaps",
      badge: "Smart",
      badgeVariant: "secondary" as const,
    },
  ];

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Powerful Features</h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to optimize and manage your resume
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            badge={feature.badge}
            badgeVariant={feature.badgeVariant}
          />
        ))}
      </div>
    </div>
  );
}
