"use client"

import UploadZone from "@/components/UploadZone";
import { useState } from "react";

export default function Home() {
	const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
	const [result, setResult] = useState("")

	async function handleFile(file: File) {
		setStatus("loading")
		try {
			const formData = new FormData()
			formData.append("file", file)
			const res = await fetch("/api/analyze", { method: "POST", body: formData })
			const data = await res.json()
			setResult(data.text)
			setStatus("done")
		} catch(error) {
			setStatus("error")
		}
	}

	return (
		<>
			{status === "idle" && <UploadZone onFileSelected={handleFile} />}
			{status === "loading" && <p>Processing data</p>}
			{status === "done" && <pre>{result}</pre>}
			{status === "error" && <p>An error has occured</p>}
		</>
	)
}
