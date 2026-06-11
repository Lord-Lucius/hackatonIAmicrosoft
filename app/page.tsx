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
	const [result, setResult] = useState("")
	const [cvText, setCvText] = useState("")
	const [job, setJob] = useState("")
	const [match, setMatch] = useState<MatchResult | null>(null)
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

	async function handleCompare() {
		const res = await fetch("/api/match", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ cv_text: cvText, job_description: job })
		})
		const data = await res.json()
		setMatch(data)
	}

	async function handleFile(file: File) {
		setStatus("loading")
		try {
			const formData = new FormData()
			formData.append("file", file)
			const res = await fetch("/api/analyze", { method: "POST", body: formData })
			const data = await res.json()
			setResult(data.text)
			setCvText(data.text)
			setAnalysis(data.analyze)
			setStatus("done")
		} catch(error) {
			setStatus("error")
		}
	}

	return (
		<main className="flex flex-col items-center text-center">
			{status === "idle" && <UploadZone onFileSelected={handleFile} />}
			{status === "loading" && <p>Processing data</p>}
			{status === "error" && <p>An error has occured</p>}

			{status === "done" && analysis && (
				<div className="w-full max-w-3xl flex flex-col items-center gap-6 p-8">
					<h1 className="text-2xl font-bold">Analyse du CV</h1>

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
						className="mt-3 px-4 py-2 rounded-xl font-semibold"
						style={{ background: "var(--accent)", color: "#fff" }}
					>
						Comparer
					</button>

					{match && <MatchingPanel result={match} />}
					</section>
				</div>
			)}
		</main>
	)
}
