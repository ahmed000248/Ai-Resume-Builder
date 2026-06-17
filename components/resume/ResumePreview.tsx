import React from "react";
import { ResumeFormData } from "@/types/resume";
import { Card } from "../ui/Card";
import { Mail, Phone, Linkedin, Globe, Briefcase, GraduationCap, Code } from "lucide-react";

type ResumePreviewProps = {
  data: ResumeFormData;
};

export function ResumePreview({ data }: ResumePreviewProps) {
  const { personal, experience, education, skills } = data;

  return (
    <Card className="bg-white text-slate-900 border border-slate-200 shadow-xl p-8 max-w-4xl mx-auto font-sans leading-relaxed text-sm">
      <div className="text-center border-b border-slate-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">
          {personal.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mt-3 text-slate-600 text-xs font-semibold">
          {personal.email && (
            <div className="flex items-center space-x-1">
              <Mail className="h-3.5 w-3.5" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="h-3.5 w-3.5" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center space-x-1">
              <Linkedin className="h-3.5 w-3.5" />
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </div>
          )}
          {personal.portfolio && (
            <div className="flex items-center space-x-1">
              <Globe className="h-3.5 w-3.5" />
              <a href={personal.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Portfolio
              </a>
            </div>
          )}
        </div>
      </div>

      {experience && experience.length > 0 && experience[0].company && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5 mb-3">
            <Briefcase className="h-4 w-4 text-slate-800" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Professional Experience</h2>
          </div>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{exp.role}</h3>
                    <p className="text-slate-600 font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-slate-500 text-xs font-bold whitespace-nowrap">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && education[0].school && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5 mb-3">
            <GraduationCap className="h-4 w-4 text-slate-800" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Education</h2>
          </div>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{edu.school}</h3>
                  <p className="text-slate-600 text-xs font-semibold">{edu.degree}</p>
                </div>
                <span className="text-slate-500 text-xs font-bold">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5 mb-3">
            <Code className="h-4 w-4 text-slate-800" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
