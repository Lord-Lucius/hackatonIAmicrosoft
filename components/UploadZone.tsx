"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadZone({ onFileSelected }: { onFileSelected: (file: File) => void }) {
const onDrop = useCallback((acceptedFiles: File[]) => {
	onFileSelected(acceptedFiles[0]);
}, [onFileSelected]);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
	onDrop,
	accept: { "application/pdf": [".pdf"] },
	maxFiles: 1,
});

return (
	<div
		{...getRootProps()}
		className="w-screen h-screen flex flex-col items-center justify-center border-2 border-dashed border-slate-500 cursor-pointer"
	>
		<input {...getInputProps()} />
		{isDragActive
			? <p>Déposez le PDF ici…</p>
			: <p>Glissez votre CV (format PDF), ou cliquez pour choisir</p>}
	</div>
);
}
