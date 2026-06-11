"use client"

import MatchingPanel from "@/components/MatchingPanel";
import UploadZone from "@/components/UploadZone";
import { useState, useEffect } from "react";
import type { AnalysisResult, MatchResult } from "@/types/analysis";
import SummaryCard from "@/components/SummaryCard";
import SkillsTags from "@/components/SkillsTags";
import StrengthWeaknessList from "@/components/StrengthWeaknessList";
import JobSuggestions from "@/components/JobSuggestions";

export default function Home() {
	const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
	const [errorMessage, setErrorMessage] = useState("")
	const [cvText, setCvText] = useState("")
	const [job, setJob] = useState("")
	const [match, setMatch] = useState<MatchResult | null>(null)
	const [matchLoading, setMatchLoading] = useState(false)
	const [matchError, setMatchError] = useState("")
	const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

	useEffect(() => {
		const prevent = (e: DragEvent) => e.preventDefault();
		window.addEventListener("dragover", prevent);
		window.addEventListener("drop", prevent);
		return () => {
			window.removeEventListener("dragover", prevent);
			window.removeEventListener("drop", prevent);
		};
	}, []);

	async function handleFile(file: File) {
		setStatus("loading")
		setErrorMessage("")
		try {
			const formData = new FormData()
			formData.append("file", file)
			const res = await fetch("/api/analyze", { method: "POST", body: formData })
			const data = await res.json()
			if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'analyse")
			setCvText(data.text)
			setAnalysis(data.analyze)
			setStatus("done")
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue")
			setStatus("error")
		}
	}

	async function handleCompare() {
		if (!job.trim()) {
			setMatchError("Veuillez coller une offre d'emploi.")
			return
		}
		setMatchLoading(true)
		setMatchError("")
		try {
			const res = await fetch("/api/match", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ cv_text: cvText, job_description: job })
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error ?? "Erreur lors de la comparaison")
			setMatch(data)
		} catch (error) {
			setMatchError(error instanceof Error ? error.message : "La comparaison a échoué.")
		} finally {
			setMatchLoading(false)
		}
	}

	return (
		<main className="flex flex-col items-center text-center min-h-screen">
			{status === "idle" && <UploadZone onFileSelected={handleFile} />}

			{status === "loading" && (
				<div className="flex flex-col items-center justify-center min-h-screen gap-4">
					<div
						className="w-10 h-10 rounded-full animate-spin"
						style={{ border: "3px solid var(--border)", borderTopColor: "var(--accent)" }}
					/>
					<p style={{ color: "var(--text-dim)" }}>Analyse du CV en cours…</p>
				</div>
			)}

			{status === "error" && (
				<div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
					<p style={{ color: "var(--danger)" }}>{errorMessage || "Une erreur est survenue."}</p>
					<button
						onClick={() => { setStatus("idle"); setErrorMessage("") }}
						className="px-4 py-2 rounded-xl font-semibold"
						style={{ background: "var(--accent)", color: "#fff" }}
					>
						Réessayer
					</button>
				</div>
			)}

			{status === "done" && analysis && (
				<div className="w-full max-w-3xl flex flex-col items-center gap-6 p-8">
					<h1 className="text-3xl font-bold">Analyse du CV</h1>

					<SummaryCard analysis={analysis} />
					<SkillsTags skills={analysis.skills} />
					<StrengthWeaknessList
						strengths={analysis.strengths}
						weaknesses={analysis.weaknesses}
					/>
					<JobSuggestions jobs={analysis.recommended_jobs} />

					<section className="w-full flex flex-col items-center mt-8">
						<h2 className="text-xl font-bold mb-3">Comparer à une offre</h2>
						<textarea
							value={job}
							onChange={(e) => setJob(e.target.value)}
							placeholder="Collez l'offre d'emploi ici"
							className="w-full h-40 rounded-xl p-3"
							style={{ background: "var(--surface)", color: "var(--text)" }}
						/>
						<button
							onClick={handleCompare}
							disabled={matchLoading}
							className="mt-3 px-4 py-2 rounded-xl font-semibold disabled:opacity-50"
							style={{ background: "var(--accent)", color: "#fff" }}
						>
							{matchLoading ? "Comparaison…" : "Comparer"}
						</button>

						{matchError && (
							<p className="mt-3 text-sm" style={{ color: "var(--danger)" }}>{matchError}</p>
						)}

						{match && <MatchingPanel result={match} />}
					</section>
				</div>
			)}
		</main>
	)
}
