export type Props = {
  system: System;
  actions: Actions;
};

export type System = {
  title: string;
  excerpt: string;
  content: string;
  tagsInput: string;
  tags: string[];
  coverUrl: string;
  isSubmitting: boolean;
  error: string | null;
  titleError: string | null;
  contentError: string | null;
  coverFile: File | null;
  coverPreviewUrl: string | null;
  coverError: string | null;
  isDraggingCover: boolean;
};

export type Actions = {
  setTitle: (v: string) => void;
  setExcerpt: (v: string) => void;
  setContent: (v: string) => void;
  setTagsInput: (v: string) => void;
  removeTag: (t: string) => void;
  setCoverUrl: (v: string) => void;
  setCoverFromInput: (file?: File) => void;
  clearCover: () => void;
  onCoverDrop: (e: React.DragEvent) => void;
  onCoverDragOver: (e: React.DragEvent) => void;
  onCoverDragEnter: (e: React.DragEvent) => void;
  onCoverDragLeave: (e: React.DragEvent) => void;
  saveDraft: () => void;
  publish: () => void;
};
