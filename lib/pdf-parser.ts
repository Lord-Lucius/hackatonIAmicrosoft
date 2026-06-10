import { PDFParse } from "pdf-parse";

export async function extractText(buff: Buffer): Promise<string> {
	const parser = new PDFParse({ data: buff })
	const result = await parser.getText()
	return result.text
}
