import { StepFlow } from "@/components/features/StepFlow";
import { FeaturesShowcase } from "@/components/features/FeaturesShowcase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  Sparkles,
  Edit,
  Eye,
  Download,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function FlowPage() {
  const userFlowSteps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload Your Resume",
      description: "Start by uploading your resume as a PDF file",
      details: [
        "Supported format: PDF only",
        "Maximum file size: 10MB",
        "Optional: Add job description for job matching",
      ],
    },
    {
      number: 2,
      icon: Sparkles,
      title: "AI Analysis",
      description: "Intelligent analysis of your resume across multiple dimensions",
      details: [
        "Scores: Relevance, Experience, Skills, Education, Formatting, Impact",
        "Extracts: Name, contact, skills, experience, education",
        "Suggestions: Ranked by priority (High, Medium, Low)",
        "Job Match: If job description provided",
      ],
    },
    {
      number: 3,
      icon: Edit,
      title: "Edit & Improve",
      description: "Open the resume editor to make improvements",
      details: [
        "Edit Basics: Name, email, phone, summary",
        "Edit Work: Add/remove jobs, highlights, dates",
        "Edit Education: Degrees, institutions, dates, GPA",
        "Edit Skills: Add skills with proficiency levels",
      ],
    },
    {
      number: 4,
      icon: Eye,
      title: "Live Preview",
      description: "See your changes instantly with multiple template options",
      details: [
        "Modern template: Professional serif layout",
        "ATS template: Optimized for applicant tracking systems",
        "Creative template: Unique and visually appealing",
        "Switch templates without losing any data",
      ],
    },
    {
      number: 5,
      icon: Download,
      title: "Export & Download",
      description: "Download your resume as a PDF in your chosen template",
      details: [
        "Browser print dialog for native PDF export",
        "Professional formatting preserved",
        "Template-specific styling applied",
        "Ready to send to employers",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-8 md:py-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Resume Analyzer Flow</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Complete visualization of how to use the resume analyzer and editor to optimize your
              resume
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12 space-y-16">
        {/* User Flow */}
        <section className="space-y-8">
          <StepFlow
            steps={userFlowSteps}
            title="Complete User Flow"
            subtitle="Follow these 5 steps to analyze and improve your resume"
          />
        </section>

        {/* CTA Section */}
        <section className="py-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-base">
                Upload your resume and let AI analyze it
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard/new">
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/dashboard/history">
                  View Previous Analyses
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Features Showcase */}
        <section className="space-y-8">
          <FeaturesShowcase />
        </section>

        {/* How It Works Detail Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Key Capabilities</h2>
            <p className="text-muted-foreground text-lg">
              Understand what each section of the editor can do
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Basics Section */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your basic contact and summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Editable Fields</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Full Name</li>
                    <li>✓ Email Address</li>
                    <li>✓ Phone Number</li>
                    <li>✓ Professional Summary</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Auto-save on blur</li>
                    <li>✓ AI suggestions</li>
                    <li>✓ Real-time preview</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Work Section */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Build and refine your job history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Per Job Entry</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Company name</li>
                    <li>✓ Job title/position</li>
                    <li>✓ Start & end dates</li>
                    <li>✓ Achievement highlights</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Capabilities</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Add/remove jobs</li>
                    <li>✓ Expand/collapse cards</li>
                    <li>✓ Manage bullet points</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Showcase your academic credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Per Education Entry</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Institution name</li>
                    <li>✓ Degree type</li>
                    <li>✓ Field of study</li>
                    <li>✓ Graduation dates & GPA</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Management</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Add/remove entries</li>
                    <li>✓ Edit all fields</li>
                    <li>✓ Auto-save changes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Highlight your technical and soft skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Skill Attributes</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Skill name</li>
                    <li>✓ Proficiency level</li>
                    <li>✓ Beginner → Expert scale</li>
                    <li>✓ Color-coded badges</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tools</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Quick add with Enter key</li>
                    <li>✓ Change proficiency level</li>
                    <li>✓ Remove skills instantly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Templates Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Resume Templates</h2>
            <p className="text-muted-foreground text-lg">
              Choose from 3 professional templates
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Modern",
                description: "Clean, professional serif layout perfect for traditional roles",
                features: ["Serif fonts", "Classic layout", "Professional appearance"],
              },
              {
                name: "ATS Friendly",
                description: "Optimized for applicant tracking systems to pass filters",
                features: ["Simple formatting", "No special characters", "ATS-compatible"],
              },
              {
                name: "Creative",
                description: "Stand out with a unique, modern design for creative roles",
                features: ["Contemporary style", "Visual interest", "Modern fonts"],
              },
            ].map((template) => (
              <Card key={template.name}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {template.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-8 border-t">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Start Optimizing Your Resume Today</h2>
            <p className="text-muted-foreground">
              Upload your resume, get AI analysis, and improve across all dimensions
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard/new">
                <Upload className="h-4 w-4" />
                Get Started
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
