import { MatchResult } from "@/types/analysis";

function scoreColor(score: number): string {
	if (score >= 75) return "var(--success)";
	if (score >= 50) return "#F59E0B"; // orange (pas de variable dédiée)
	return "var(--danger)";
}

export default function MatchingPanel({ result }: { result: MatchResult }) {
	return (
		<div className="rounded-2xl p-6 mt-6 w-full" style={{ background: "var(--surface)" }}>
		<div
			className="text-5xl font-bold text-center"
			style={{ color: scoreColor(result.match_score) }}
		>
			{result.match_score}%
		</div>

		<div className="grid grid-cols-2 gap-6 mt-6">
			<div>
			<h3 className="font-semibold mb-2" style={{ color: "var(--success)" }}>
				Compétences présentes
			</h3>
			<ul className="space-y-1 text-sm">
				{result.matched_skills.map((skill) => (
				<li key={skill}>{skill}</li>
				))}
			</ul>
			</div>

			<div>
			<h3 className="font-semibold mb-2" style={{ color: "var(--danger)" }}>
				Compétences manquantes
			</h3>
			<ul className="space-y-1 text-sm">
				{result.missing_skills.map((skill) => (
				<li key={skill}>{skill}</li>
				))}
			</ul>
			</div>
		</div>

		<p className="mt-4 text-sm" style={{ color: "var(--text-dim)" }}>
			{result.recommendation}
		</p>
		</div>
	);
}
