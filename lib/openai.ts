import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export interface AnalysisResponse {
  score: number;
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  rewritten_bullets: {
    experience: string[];
    projects: string[];
  };
  overall_summary: string;
}

export interface OptimizedResumeResponse {
  optimizedResume: string;
  sections: {
    summary: string;
    experience: string[];
    projects: string[];
    skills: string[];
  };
}

/**
 * Sends a resume and a job description to GPT-4o for ATS analysis.
 * Falls back to high-quality mock evaluation if OPENAI_API_KEY is not defined.
 */
export async function getResumeAnalysis(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResponse> {
  if (!openai) {
    return getMockAnalysis(resumeText, jobDescription);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS resume analyst and professional career coach. Analyze resumes according to modern ATS systems. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `Analyze this resume against the target job description.\n\nResume Text:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nExpected JSON Schema:\n{\n  "score": number,\n  "missing_keywords": ["string"],\n  "strengths": ["string"],\n  "weaknesses": ["string"],\n  "rewritten_bullets": {\n    "experience": ["string"],\n    "projects": ["string"]\n  },\n  "overall_summary": "string"\n}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("OpenAI API error during analysis:", error);
    throw error;
  }
}

/**
 * Generates an optimized resume based on ATS analysis recommendations using GPT-4o-mini.
 * Falls back to a mock template if OPENAI_API_KEY is not defined.
 */
export async function generateOptimizedResume(
  analysisResult: unknown,
  resumeData: unknown
): Promise<OptimizedResumeResponse> {
  if (!openai) {
    return getMockOptimizedResume(resumeData);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Help generate a fully optimized professional resume based on the original resume data and the target ATS analysis recommendations. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `Create an optimized resume using this original data and analysis.\n\nAnalysis:\n${JSON.stringify(
            analysisResult
          )}\n\nOriginal Resume:\n${JSON.stringify(
            resumeData
          )}\n\nExpected JSON Schema:\n{\n  "optimizedResume": "string",\n  "sections": {\n    "summary": "string",\n    "experience": ["string"],\n    "projects": ["string"],\n    "skills": ["string"]\n  }\n}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text) as OptimizedResumeResponse;
  } catch (error) {
    console.error("OpenAI API error during resume generation:", error);
    throw error;
  }
}

function getMockAnalysis(resumeText: string, jobDescription: string): AnalysisResponse {
  const words = jobDescription.toLowerCase().match(/\b[a-z]{3,15}\b/g) || [];
  const keywordCandidates = Array.from(new Set(words))
    .filter(
      (w) =>
        !["and", "the", "for", "with", "this", "that", "from", "your", "will", "this"].includes(
          w
        )
    )
    .slice(0, 8)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));

  const firstLine = resumeText.trim().split("\n")[0] || "Candidate";

  return {
    score: Math.floor(Math.random() * 15) + 70, // 70-85
    missing_keywords:
      keywordCandidates.length > 3
        ? keywordCandidates
        : ["CI/CD Pipelines", "Docker", "Kubernetes", "Redis", "TypeScript", "Jest & RTL"],
    strengths: [
      `Demonstrates core capabilities matching: ${
        keywordCandidates.slice(0, 3).join(", ") || "TypeScript & React"
      }.`,
      "Well-defined sections conforming to standard single-page structures.",
      "Clear educational background aligned with industry standards.",
    ],
    weaknesses: [
      "Needs more quantitative results and performance metrics (e.g. %, $).",
      "Missing DevOps, orchestration, or automated testing keywords.",
      "Professional summary should focus more directly on target outcomes.",
    ],
    rewritten_bullets: {
      experience: [
        "Architected scalable interfaces leading to a 32% boost in core page load speed.",
        "Refactored complex state models using custom React context, reducing boilerplate by 40%.",
        "Wrote automated unit & integration testing suites using Jest to secure 90% code coverage.",
      ],
      projects: [
        "Built a complete serverless SaaS platform utilizing Next.js 14 and Firestore, reducing latency by 25%.",
        "Wired automated pipelines via GitHub Actions to deploy containerized modules securely.",
      ],
    },
    overall_summary: `The resume for ${firstLine} displays a robust set of credentials. Including target action-verbs and exact keywords from the job description will improve ATS scanner readability.`,
  };
}

interface MiniResumeData {
  summary?: string;
  skills?: string[];
}

function getMockOptimizedResume(resumeData: unknown): OptimizedResumeResponse {
  const rData = (resumeData || {}) as MiniResumeData;
  const summary =
    rData.summary ||
    "Highly skilled Software Engineer experienced in building scalable web applications.";
  const skills = Array.isArray(rData.skills)
    ? rData.skills
    : ["React", "TypeScript", "Next.js", "Node.js"];

  return {
    optimizedResume: `OPTIMIZED RESUME\n\nSUMMARY\n${summary} Focused on implementing optimized architectures, reducing latency, and delivering clean, accessible user experiences.\n\nSKILLS\n${skills.join(
      ", "
    )}, CI/CD, Jest & RTL, Docker\n\nPROFESSIONAL EXPERIENCE\n- Re-engineered core components resulting in a 30% performance boost.\n- Integrated comprehensive testing coverage to guarantee codebase resilience.`,
    sections: {
      summary: `${summary} Focused on implementing optimized architectures, reducing latency, and delivering clean, accessible user experiences.`,
      experience: [
        "Re-engineered core frontend components resulting in a 30% performance boost.",
        "Integrated comprehensive testing coverage using Jest & React Testing Library to guarantee codebase resilience.",
      ],
      projects: [
        "Architected an AI Resume SaaS featuring secure authentication, document parsers, and custom PDF generator layouts.",
      ],
      skills: [...skills, "CI/CD", "Jest & RTL", "Docker"],
    },
  };
}
