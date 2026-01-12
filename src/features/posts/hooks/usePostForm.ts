import { useMemo, useState } from "react";
import type { Actions, System } from "../types/post.types";


export function usePostForm() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  function syncTags(raw: string) {
    const list = raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 8);
    setTags(list);
  }

  function validate() {
    let ok = true;
    setTitleError(null);
    setContentError(null);

    const t = title.trim();
    const c = content.trim();

    if (!t) {
      setTitleError("El título es requerido.");
      ok = false;
    } else if (t.length > 120) {
      setTitleError("Máximo 120 caracteres.");
      ok = false;
    }

    if (!c) {
      setContentError("El contenido es requerido.");
      ok = false;
    } else if (c.length < 30) {
      setContentError("Escribí un poco más (mínimo 30 caracteres).");
      ok = false;
    }

    return ok;
  }

  function setCoverImage(file: File | null) {
    setCoverError(null);

    if (!file) {
      setCoverFile(null);
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      setCoverPreviewUrl(null);
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setCoverError("Formato no soportado. Usá JPG, PNG o WEBP.");
      return;
    }

    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      setCoverError(`La imagen supera los ${maxMB}MB.`);
      return;
    }

    setCoverFile(file);

    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(URL.createObjectURL(file));
  }

  const actions: Actions = useMemo(
    () => ({
      setTitle,
      setExcerpt,
      setContent,
      setTagsInput: (v) => {
        setTagsInput(v);
        syncTags(v);
      },
      removeTag: (t) => setTags((prev) => prev.filter((x) => x !== t)),
      setCoverUrl,
      saveDraft: () => {
        setError(null);
        // luego: llamar endpoint draft
        console.log("draft", { title, excerpt, content, tags, coverUrl });
      },
      publish: async () => {
        setError(null);
        const ok = validate();
        if (!ok) return;

        setIsSubmitting(true);
        try {
          // luego: llamar endpoint posts
          console.log("publish", { title, excerpt, content, tags, coverUrl });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          setError("No se pudo publicar. Intentá de nuevo.");
        } finally {
          setIsSubmitting(false);
        }
      },
      setCoverFromInput: (file?: File) => setCoverImage(file ?? null),

      clearCover: () => setCoverImage(null),

      onCoverDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingCover(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setCoverImage(file);
      },

      onCoverDragOver: (e: React.DragEvent) => {
        e.preventDefault();
      },

      onCoverDragEnter: (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingCover(true);
      },

      onCoverDragLeave: (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingCover(false);
      },
    }),
    [title, excerpt, content, tags, coverUrl]
  );

  const system: System = useMemo(
    () => ({
      title,
      excerpt,
      content,
      tagsInput,
      tags,
      coverUrl,
      isSubmitting,
      error,
      titleError,
      contentError,
      coverFile,
      coverPreviewUrl,
      coverError,
      isDraggingCover,
    }),
    [
      title,
      excerpt,
      content,
      tagsInput,
      tags,
      coverUrl,
      isSubmitting,
      error,
      titleError,
      contentError,
      coverFile,
      coverPreviewUrl,
      coverError,
      isDraggingCover,
    ]
  );

  return { system, actions };
}
