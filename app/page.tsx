"use client"

import MatchingPanel from "@/components/MatchingPanel";
import UploadZone from "@/components/UploadZone";
import { useState, useEffect } from "react";
import type { MatchResult } from "@/types/analysis";

export default function Home() {
	const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
	const [result, setResult] = useState("")
	const [cvText, setCvText] = useState("")
	const [job, setJob] = useState("")
	const [match, setMatch] = useState<MatchResult | null>(null)

	useEffect(() => {
		console.log("useEffect anti-drop monté");   // ← ajoute ça
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

			{status === "done" && (
			<div className="w-full max-w-3xl flex flex-col items-center gap-6">
				<pre className="whitespace-pre-wrap text-left w-full">{result}</pre>

				<section className="w-full flex flex-col items-center mt-8">
					<textarea
						value={job}
						onChange={(e) => setJob(e.target.value)}
						placeholder="Collez l'offre d'emploi ici"
						className="w-full h-40 rounded-xl p-3 bg-slate-800"
					/>
					<button onClick={handleCompare} className="mt-3 px-4 py-2 rounded-xl bg-indigo-500">
						Comparer
					</button>

					{match && <MatchingPanel result={match} />}
				</section>
			</div>
			)}
		</main>
	)
}
