"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadZone({ onFileSelected }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFileSelected(acceptedFiles[0]);   // remonte le fichier au parent
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive
        ? <p>Déposez le PDF ici…</p>
        : <p>Glissez votre CV PDF, ou cliquez pour choisir</p>}
    </div>
  );
}
