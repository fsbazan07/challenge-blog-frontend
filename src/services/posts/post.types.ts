import type { ApiError } from "../http/types";

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

export type PostStatus = "draft" | "published" | "deleted";

export type PostAuthor = {
  id: string;
  name: string;
  email: string;
};

export type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  content?: string; // solo en detail / edit
  coverUrl: string | null;
  tags: string[];
  status: PostStatus;
  created_at: string;
  author: PostAuthor | null;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

// -------- Requests --------

export type ListPostsParams = {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
};

export type CreatePostRequest = {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  status?: PostStatus;
  cover?: File | null;
};

export type UpdatePostRequest = {
  title?: string;
  content?: string;
  excerpt?: string | null;
  tags?: string[];
  status?: PostStatus;
  removeCover?: boolean;
  cover?: File | null;
};

export type FeedQuery = {
  page: number;
  limit: number;
  q?: string;
  tag?: string;
};

export type FeedSystem = {
  items: Post[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  q: string;
  tag: string;

  isLoading: boolean;
  error: ApiError | null;
};

export type FeedActions = {
  setQ: (v: string) => void;
  setTag: (v: string) => void;

  setPage: (v: number) => void;
  setLimit: (v: number) => void;

  goToPage: (p: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  fetch: () => Promise<void>;
  refresh: () => Promise<void>;
  clearFilters: () => void;
};

export type MyPostsSystem = {
  items: Post[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  q: string;
  tag: string;

  isLoading: boolean;
  error: ApiError | null;
  confirmOpen: boolean;
  isDeleting: boolean;
  selectedPostId: string | null;

};

export type MyPostsActions = {
  setQ: (v: string) => void;
  setTag: (v: string) => void;

  setPage: (v: number) => void;
  setLimit: (v: number) => void;

  goToPage: (p: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  fetch: () => Promise<void>;
  refresh: () => Promise<void>;

  clearFilters: () => void;

  openConfirm: (postId: string) => void;
  closeConfirm: () => void;
  deletePost: () => Promise<void>;
  
};
