import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Step {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string[];
}

interface StepFlowProps {
  steps: Step[];
  title: string;
  subtitle?: string;
}

export function StepFlow({ steps, title, subtitle }: StepFlowProps) {
  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
      </div>

      <div className="grid gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.number} className="relative">
              {/* Arrow connector */}
              {!isLast && (
                <div className="absolute left-6 top-20 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/20" />
              )}

              {/* Step Card */}
              <div className="relative z-10">
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Step Number Circle */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                            {step.number}
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          </div>
                          <CardDescription className="text-base">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="flex-shrink-0 p-3 bg-primary/5 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardHeader>

                  {/* Details */}
                  {step.details && step.details.length > 0 && (
                    <CardContent>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
