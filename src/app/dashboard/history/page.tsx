"use client";

import Link from "next/link";
import { History as HistoryIcon, FileText, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function HistoryPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <h1 className="text-sm font-semibold">History</h1>
      </header>

      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Analysis history
              </h2>
              <p className="text-sm text-muted-foreground">
                View all your past resume analyses.
              </p>
            </div>
            <Button className="gap-2" size="sm" asChild>
              <Link href="/dashboard/new">
                <FilePlus className="h-3.5 w-3.5" />
                New analysis
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <HistoryIcon className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium">No history yet</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Your completed analyses will appear here.
                </p>
                <Button size="sm" className="gap-2" asChild>
                  <Link href="/dashboard/new">
                    <FilePlus className="h-3.5 w-3.5" />
                    New analysis
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
