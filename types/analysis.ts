export type AnalysisResult = {
  id?: string;
  atsScore: number;
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  original: string;
  improved: string;
  createdAt?: string;
};
