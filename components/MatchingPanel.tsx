import { MatchResult } from "@/types/analysis";

function scoreColor(score: number): string {
  if (score >= 75) return "#22C55E";
  if (score >= 50) return "#F59E0B";
  return "#F43F5E";
}

export default function MatchingPanel({ result }: { result: MatchResult }) {
return (
	<div className="rounded-2xl p-6 mt-6 bg-slate-800">
	<div
		className="text-5xl font-bold"
		style={{ color: scoreColor(result.match_score) }}
	>
		{result.match_score}%
	</div>

	<div className="grid grid-cols-2 gap-6 mt-6">
		<div>
		<h3 className="text-green-500 font-semibold mb-2">Compétences présentes</h3>
		<ul>
			{result.matched_skills.map((skill) => (
			<li key={skill}>{skill}</li>
			))}
		</ul>
		</div>

		<div>
		<h3 className="text-red-500 font-semibold mb-2">Compétences manquantes</h3>
		<ul>
			{result.matched_skills.map((skill) => (
			<li key={skill}>{skill}</li>
			))}
		</ul>
		</div>
	</div>

	<p className="mt-4 text-sm text-slate-300">{result.recommendation}</p>
	</div>
);
}
