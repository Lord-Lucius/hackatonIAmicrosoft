export default function SkillsTags({ skills }: { skills: string[] }) {
return (
	<div className="rounded-2xl p-6 w-full" style={{ background: "var(--surface)" }}>
	<h3 className="font-semibold mb-3">Compétences détectées</h3>

	<div className="flex flex-wrap gap-2">
		{skills.map((skill) => (
		<span
			key={skill}
			className="font-mono-data text-sm px-3 py-1 rounded-lg"
			style={{ background: "var(--border)", color: "var(--text)" }}
		>
			{skill}
		</span>
		))}
	</div>
	</div>
);
}
