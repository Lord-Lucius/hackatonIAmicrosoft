import { AnalysisResult } from "@/types/analysis";

const levelStyle: Record<AnalysisResult["level"], { label: string; color: string }> = {
  junior:       { label: "Junior",        color: "#3B82F6" },
  intermediate: { label: "Intermédiaire", color: "#6366F1" },
  senior:       { label: "Senior",        color: "#22C55E" },
};

export default function SummaryCard({ analysis }: {analysis: AnalysisResult}) {
	const lvl = levelStyle[analysis.level]

	return (
		<div className="rounded-2xl p-6 w-full" style={{ background: "var(--surface)" }}>
			<span
				className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
				style={{ background: lvl.color, color: "#fff" }}
			>
				{lvl.label}
			</span>

			<p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>
				{analysis.level_reason}
			</p>

			<p>{analysis.summary}</p>
		</div>
	)
}
