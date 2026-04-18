"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Account settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Account settings will be available here once your profile is set
              up.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
