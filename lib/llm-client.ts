import OpenAI from "openai";
import { AnalysisResult, MatchResult } from "@/types/analysis";

const client = new OpenAI({
	baseURL: "https://models.github.ai/inference",
	apiKey: process.env.GITHUB_TOKEN
})

const SYSTEM_PROMPT = `
Tu es un expert RH et recruteur technique senior.
On te fournit le texte brut d'un CV. Analyse-le et réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans bloc markdown, sans commentaire.

Réponds dans la langue du CV. Respecte EXACTEMENT cette structure :

{
  "summary": "résumé professionnel synthétique en 2 ou 3 phrases",
  "level": "junior | intermediate | senior",
  "level_reason": "explication courte du niveau estimé, basée sur l'expérience et les responsabilités",
  "skills": ["compétences techniques concrètes détectées dans le CV"],
  "strengths": ["points forts réels du profil"],
  "weaknesses": ["lacunes ou points à améliorer, formulés de façon constructive"],
  "recommended_jobs": ["intitulés de postes adaptés au profil"]
}

Règles :
- "level" doit valoir EXACTEMENT l'une de ces trois valeurs : "junior", "intermediate" ou "senior". Aucune autre.
- Chaque liste contient entre 3 et 6 éléments, sauf si le CV ne permet pas d'en trouver autant.
- Base-toi UNIQUEMENT sur le contenu du CV. N'invente aucune compétence ou expérience absente.
- Si une information manque, ne remplis pas le champ avec du faux : mets une liste plus courte ou une mention honnête.
`

const MATCH_PROMPT = `
Tu es un expert en recrutement technique senior.
On te fournit le texte d'un CV et le texte d'une offre d'emploi, séparés par des balises.
Évalue l'adéquation entre le profil et l'offre, puis réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans bloc markdown, sans commentaire.

Réponds dans la langue du CV. Respecte EXACTEMENT cette structure :

{
  "match_score": 0,
  "matched_skills": ["compétences exigées par l'offre ET présentes dans le CV"],
  "missing_skills": ["compétences exigées par l'offre mais absentes du CV"],
  "recommendation": "conseil court et actionnable pour améliorer l'adéquation du candidat à cette offre"
}

Règles :
- "match_score" est un nombre entier entre 0 et 100, représentant le pourcentage d'adéquation global.
- Sois strict et réaliste : ne donne pas 100 par défaut. Un profil qui ne couvre que la moitié des exigences doit avoir un score autour de 50.
- "matched_skills" et "missing_skills" se basent UNIQUEMENT sur les compétences réellement demandées dans l'offre.
- N'invente aucune compétence : si le CV ne la mentionne pas, elle est manquante.
- Si l'offre est vague ou très courte, base-toi sur ce qui est explicitement écrit, sans extrapoler.
`

export async function analyzeCV(text: string): Promise<AnalysisResult> {
	const response = await client.chat.completions.create({
		model: "openai/gpt-4o-mini",
		messages: [
			{role: "system", content: SYSTEM_PROMPT},
			{role: "user", content: text}
		],
		response_format: {type: "json_object"}
	})

	const content = response.choices[0].message.content ?? "{}"
	return JSON.parse(content)
}

export async function matchCV(cvText: string, jobDescription: string): Promise<MatchResult> {
	const userContent = "=== CV ===\n" + cvText + "\n=== OFFRE ===\n" + jobDescription
	const response = await client.chat.completions.create({
		model: "openai/gpt-4o-mini",
		messages: [
			{role: "system", content: MATCH_PROMPT},
			{role: "user", content: userContent}
		],
		response_format: {type: "json_object"}
	})

	const content = response.choices[0].message.content ?? "{}"
	return JSON.parse(content)
}
