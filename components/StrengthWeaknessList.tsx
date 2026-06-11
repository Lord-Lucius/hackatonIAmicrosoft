export default function StrengthWeaknessList({ strengths, weaknesses }: {
	strengths: string[];
	weaknesses: string[];
}) {
	return (
		<div className="grid grid-cols-2 gap-6 w-full">
		<div className="rounded-2xl p-6" style={{ background: "var(--surface)" }}>
			<h3 className="font-semibold mb-3" style={{ color: "var(--success)" }}>
			Points forts
			</h3>
			<ul className="space-y-1 text-sm">
			{strengths.map((s) => (
				<li key={s}>✦ {s}</li>
			))}
			</ul>
		</div>

		<div className="rounded-2xl p-6" style={{ background: "var(--surface)" }}>
			<h3 className="font-semibold mb-3" style={{ color: "var(--danger)" }}>
			À améliorer
			</h3>
			<ul className="space-y-1 text-sm">
			{weaknesses.map((w) => (
				<li key={w}>⚠ {w}</li>
			))}
			</ul>
		</div>
		</div>
	);
}
