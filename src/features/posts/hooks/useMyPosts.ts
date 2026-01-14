import { normalizeApiError } from "@/services/http/errors";
import type {
  MyPostsSystem,
  MyPostsActions,
} from "@/services/posts/post.types";

import { PostsService } from "@/services/posts/posts.services";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useMyPosts() {
  // ---------------------------
  // System state
  // ---------------------------
  const [items, setItems] = useState<MyPostsSystem["items"]>([]);
  const [page, setPage] = useState<MyPostsSystem["page"]>(1);
  const [limit, setLimit] = useState<MyPostsSystem["limit"]>(10);
  const [total, setTotal] = useState<MyPostsSystem["total"]>(0);

  const [q, setQ] = useState<MyPostsSystem["q"]>("");
  const [tag, setTag] = useState<MyPostsSystem["tag"]>("");

  const [isLoading, setIsLoading] = useState<MyPostsSystem["isLoading"]>(false);
  const [error, setError] = useState<MyPostsSystem["error"]>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  

  // ---------------------------
  // Core fetch
  // ---------------------------
  const fetchMine = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await PostsService.listMine({
        page,
        limit,
        q: q.trim() ? q.trim() : undefined,
        tag: tag.trim() ? tag.trim() : undefined,
      });

      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      setError(normalizeApiError(e));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, q, tag]);

  // ✅ fetch automático
  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  // ---------------------------
  // Actions
  // ---------------------------
  const totalPages = Math.ceil(total / limit);

  const actions: MyPostsActions = useMemo(
    () => ({
      setQ: (v) => {
        setQ(v);
        setPage(1);
      },
      setTag: (v) => {
        setTag(v);
        setPage(1);
      },
      setPage: (v) => setPage(v),
      setLimit: (v) => {
        setLimit(v);
        setPage(1);
      },

      goToPage: (p) => {
        const safe = Math.max(1, Math.min(p, totalPages));
        setPage(safe);
      },
      nextPage: () => setPage((prev) => Math.min(prev + 1, totalPages)),
      prevPage: () => setPage((prev) => Math.max(prev - 1, 1)),

      fetch: fetchMine,
      refresh: fetchMine,

      clearFilters: () => {
        setQ("");
        setTag("");
        setPage(1);
      },
      openConfirm: (postId: string) => {
        setSelectedPostId(postId);
        setConfirmOpen(true);
      },
      closeConfirm: () => {
        setConfirmOpen(false);
        setSelectedPostId(null);
      },
      deletePost: async () => {
        if (!selectedPostId) return;
        setIsDeleting(true);
        setError(null);
        try {
          await PostsService.remove(selectedPostId);
          await fetchMine();
          setConfirmOpen(false);
          setSelectedPostId(null);
        } catch (e) {
          setError(normalizeApiError(e));
        } finally {
          setIsDeleting(false);
        }
      },
    }),
    [fetchMine, totalPages, selectedPostId]
  );

  // ---------------------------
  // System
  // ---------------------------
  const system: MyPostsSystem = useMemo(
    () => ({
      items,
      page,
      limit,
      total,
      totalPages,
      q,
      tag,
      isLoading,
      error,
      confirmOpen,
      isDeleting,
      selectedPostId,
    }),
    [
      items,
      page,
      limit,
      total,
      totalPages,
      q,
      tag,
      isLoading,
      error,
      confirmOpen,
      isDeleting,
      selectedPostId,
    ]
  );

  return { system, actions };
}
