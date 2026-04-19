"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ResumePreviewProps {
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
  fileName: string;
}

export function ResumePreview({ extractedData }: ResumePreviewProps) {
  return (
    <div className="bg-white text-black p-8 h-full overflow-y-auto font-serif">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{extractedData.name}</h1>
        <div className="flex gap-3 text-sm mt-1 text-gray-600">
          {extractedData.email && <span>{extractedData.email}</span>}
          {extractedData.phone && <span>•</span>}
          {extractedData.phone && <span>{extractedData.phone}</span>}
        </div>
      </div>

      {/* Summary */}
      {extractedData.summary && (
        <>
          <div className="mb-4">
            <p className="text-sm leading-relaxed text-gray-700">
              {extractedData.summary}
            </p>
          </div>
          <Separator className="bg-gray-300" />
        </>
      )}

      {/* Experience */}
      {extractedData.experience.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">
              Experience
            </h2>
            <div className="space-y-4">
              {extractedData.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-bold text-gray-800">{exp.role}</p>
                    <p className="text-xs text-gray-600">{exp.duration}</p>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold">{exp.company}</p>
                  {exp.highlights.length > 0 && (
                    <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-700">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="list-disc">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Separator className="bg-gray-300" />
        </>
      )}

      {/* Education */}
      {extractedData.education.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-3">
              {extractedData.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-800">{edu.degree}</p>
                    <p className="text-xs text-gray-600">{edu.year}</p>
                  </div>
                  <p className="text-sm text-gray-700">
                    {edu.institution} · {edu.field}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Separator className="bg-gray-300" />
        </>
      )}

      {/* Skills */}
      {extractedData.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {extractedData.skills.map((skill, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs font-normal bg-gray-100 text-gray-800 border-gray-300"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
