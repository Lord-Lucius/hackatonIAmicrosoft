import { PDFParse } from "pdf-parse";

export async function extractText(buff: Buffer): Promise<string> {
	const parser = new PDFParse({ data: buff })
	try {
		const result = await parser.getText()
		return result.text
	} finally {
		await parser.destroy()
	}
}
