import { useMemo, useState } from "react";
import type { Actions, System } from "../../../services/posts/post.types";
import { normalizeApiError } from "@/services/http/errors";
import { PostsService } from "@/services/posts/posts.services";
import { useNavigate } from "react-router-dom";

export function usePostForm() {
  const navigate = useNavigate();
  // ---------------------------
  // form fields
  // ---------------------------
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState("");

  // ---------------------------
  // ui state
  // ---------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  // ---------------------------
  // cover state
  // ---------------------------
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  // ---------------------------
  // helpers
  // ---------------------------
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

    // clear
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

  function resetForm() {
    setTitle("");
    setExcerpt("");
    setContent("");
    setTagsInput("");
    setTags([]);

    setError(null);
    setTitleError(null);
    setContentError(null);

    // cover
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFile(null);
    setCoverPreviewUrl(null);
    setCoverError(null);
    setIsDraggingCover(false);
    navigate("/myposts");
  }
  // ---------------------------
  // actions
  // ---------------------------
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

      saveDraft: async () => {
        setError(null);
        const ok = validate();
        if (!ok) return;

        setIsSubmitting(true);
        try {
          await PostsService.create({
            title: title.trim(),
            content: content.trim(),
            excerpt: excerpt.trim() || undefined,
            tags,
            status: "draft",
            cover: coverFile,
          });
        } catch (e) {
          setError(
            normalizeApiError(e).message ?? "No se pudo guardar el borrador."
          );
        } finally {
          setIsSubmitting(false);
          resetForm();
        }
      },

      publish: async () => {
        setError(null);
        const ok = validate();
        if (!ok) return;

        setIsSubmitting(true);
        try {
          await PostsService.create({
            title: title.trim(),
            content: content.trim(),
            excerpt: excerpt.trim() || undefined,
            tags,
            status: "published",
            cover: coverFile,
          });

          // opcional: limpiar / navegar a /my-posts o al detail si el backend devuelve id
        } catch (e) {
          setError(
            normalizeApiError(e).message ??
              "No se pudo publicar. Intentá de nuevo."
          );
        } finally {
          setIsSubmitting(false);
          resetForm();
        }
      },
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setCoverImage, validate, title, content, excerpt, tags, coverFile]
  );

  // ---------------------------
  // system
  // ---------------------------
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
