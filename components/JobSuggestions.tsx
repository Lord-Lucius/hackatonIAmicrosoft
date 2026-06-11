export default function JobSuggestions({ jobs }: { jobs: string[] }) {
	return (
		<div className="rounded-2xl p-6 w-full" style={{ background: "var(--surface)" }}>
		<h3 className="font-semibold mb-3">Métiers recommandés</h3>

		<div className="flex flex-wrap gap-3">
			{jobs.map((job) => (
			<span
				key={job}
				className="px-4 py-2 rounded-xl text-sm"
				style={{ background: "var(--border)" }}
			>
				{job}
			</span>
			))}
		</div>
		</div>
	);
}
