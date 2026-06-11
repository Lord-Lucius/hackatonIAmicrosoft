export interface AnalysisResult {
	summary: string;
	level: "junior" | "intermediate" | "senior";
	level_reason: string;
	skills: string[];
	strenghs: string[];
	weaknesses: string[];
	recommended_jobs: string[];
}

export interface MatchResult {
	match_score: number;
	match_skilled: string[];
	missing_skills: string[];
	recommendation: string;
}
