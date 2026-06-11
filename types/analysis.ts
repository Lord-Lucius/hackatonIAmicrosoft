export interface AnalysisResult {
	summary: string;
	level: "junior" | "intermediate" | "senior";
	level_reason: string;
	skills: string[];
	strengths: string[];
	weaknesses: string[];
	recommended_jobs: string[];
}

export interface MatchResult {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendation: string;
}
