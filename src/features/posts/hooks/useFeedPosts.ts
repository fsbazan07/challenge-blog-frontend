import { normalizeApiError } from "@/services/http/errors";
import type { FeedSystem, FeedActions } from "@/services/posts/post.types";
import { PostsService } from "@/services/posts/posts.services";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useFeedPosts() {
  // ---------------------------
  // System state
  // ---------------------------
  const [items, setItems] = useState<FeedSystem["items"]>([]);
  const [page, setPage] = useState<FeedSystem["page"]>(1);
  const [limit, setLimit] = useState<FeedSystem["limit"]>(10);
  const [total, setTotal] = useState<FeedSystem["total"]>(0);

  const [q, setQ] = useState<FeedSystem["q"]>("");
  const [tag, setTag] = useState<FeedSystem["tag"]>("");

  const [isLoading, setIsLoading] = useState<FeedSystem["isLoading"]>(false);
  const [error, setError] = useState<FeedSystem["error"]>(null);

  // ---------------------------
  // Core fetch
  // ---------------------------
  const fetchFeed = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await PostsService.listFeed({
        page,
        limit,
        q: q.trim() ? q.trim() : undefined,
        tag: tag.trim() ? tag.trim() : undefined,
      });

      setItems(res.items);
      setTotal(res.total);
      // el backend te devuelve page/limit, pero acá mantenemos tus states
    } catch (e) {
      setError(normalizeApiError(e));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, q, tag]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // ---------------------------
  // Actions
  // ---------------------------
  const totalPages = Math.ceil(total / limit);

  const actions: FeedActions = useMemo(
    () => ({
      setQ: (v) => {
        setQ(v);
        // opcional: cuando cambia query reseteamos a página 1
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

      fetch: fetchFeed,
      refresh: fetchFeed,

      clearFilters: () => {
        setQ("");
        setTag("");
        setPage(1);
      },
    }),
    [fetchFeed, totalPages]
  );

  // ---------------------------
  // System
  // ---------------------------
  const system: FeedSystem = useMemo(
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
    }),
    [items, page, limit, total, totalPages, q, tag, isLoading, error]
  );

  return { system, actions };
}
