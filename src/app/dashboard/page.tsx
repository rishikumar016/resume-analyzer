"use client";

import Link from "next/link";
import { FilePlus, BarChart3, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Analyze a resume or review past results.
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/dashboard/new">
            <FilePlus className="h-4 w-4" />
            New analysis
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total analyses
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your first resume to get started
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">&mdash;</p>
            <p className="text-xs text-muted-foreground mt-1">No data yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last analysis
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">&mdash;</p>
            <p className="text-xs text-muted-foreground mt-1">
              No analyses yet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empty state / recent analyses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium">No analyses yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Upload your resume to get your first AI-powered analysis.
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
  );
}
