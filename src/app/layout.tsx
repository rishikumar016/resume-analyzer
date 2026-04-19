import type { Metadata } from "next";
import "./globals.css";
import { Manrope, Lora, Fira_Code } from "next/font/google";
import { DialogRoot } from "@/components/dialog-root";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { DialogProvider } from "@/context/dialog-context";
import { ThemeProvider } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Resume Analyzer",
  description:
    "AI-powered resume analysis — get scores, skill extraction, and actionable suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        manrope.variable,
        lora.variable,
        firaCode.variable,
      )}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider>
          <QueryProvider>
            <DialogProvider>
              {children}
              <DialogRoot />
              <Toaster />
            </DialogProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
