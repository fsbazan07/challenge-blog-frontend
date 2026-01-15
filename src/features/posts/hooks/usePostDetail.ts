import { useCallback, useMemo, useRef, useState } from "react";
import type { ApiError } from "@/services/http/types";
import type {
  Post,
  PostDetailActions,
  PostDetailSystem,
} from "@/services/posts/post.types";
import { PostsService } from "@/services/posts/posts.services";
import { normalizeApiError } from "@/services/http/errors";

export function usePostDetail() {
  const abortRef = useRef<AbortController | null>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const reset = useCallback(() => {
    // cancelar request en vuelo si existe
    abortRef.current?.abort();
    abortRef.current = null;

    setPost(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const fetch = useCallback(async (id: string) => {
    // cancelar request anterior si el usuario navega rápido
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const data = await PostsService.getById(id);

      if (controller.signal.aborted) return;
      setPost(data);
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(normalizeApiError(e));
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const actions: PostDetailActions = useMemo(
    () => ({
      fetch,
      reset,
    }),
    [fetch, reset]
  );

  const system: PostDetailSystem = useMemo(
    () => ({
      post,
      isLoading,
      error,
    }),
    [post, isLoading, error]
  );

  return { system, actions };
}
