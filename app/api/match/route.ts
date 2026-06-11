import { matchCV } from "@/lib/llm-client";
import { Console } from "console";

export async function POST(request: Request) {
	const {cv_text, job_description} = await request.json()

	if (!cv_text || !job_description) {
		return Response.json({error: "cv or job description missing"}, {status: 400})
	}

	try {
		const result = await matchCV(cv_text, job_description)
		return Response.json(result)
	} catch (error) {
		console.error("Erreur matchCV:", error)
		return Response.json({error: "match failed"}, {status: 500})
	}
}
