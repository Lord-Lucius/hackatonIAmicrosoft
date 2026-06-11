import { analyzeCV } from "@/lib/llm-client";
import { extractText } from "@/lib/pdf-parser";

export async function POST(request: Request) {
	const formData = await request.formData()
	const file = formData.get("file")
	if (!file || typeof file === "string") {
		return Response.json({ error: "no file received" }, { status: 400 });
	}
	const arrayBuffer = await file.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)
	const text = await extractText(buffer)
	if (text.trim().length < 100) {
		return Response.json({error: "text lenght too short"}, {status: 422})
	}
	try {
		const analyze = await analyzeCV(text)
		return Response.json({analyze, text})
	}catch(error) {
		console.error("Erreur analyzeCV:", error)
		return Response.json({error: "analyze failed"}, {status: 500})
	}
}
