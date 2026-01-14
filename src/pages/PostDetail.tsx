import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PostDetailLayout from "@/features/posts/components/PostDetailLayout";
import { usePostDetail } from "@/features/posts/hooks/usePostDetail";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { system, actions } = usePostDetail();

  useEffect(() => {
    if (!id) return;
    void actions.fetch(id);

    return () => actions.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {system.isLoading ? (
          <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
            Cargando post...
          </div>
        ) : null}

        {system.error ? (
          <div className="rounded-xl border border-border bg-muted p-4 text-sm">
            {system.error.message}
          </div>
        ) : null}

        {!system.isLoading && !system.error && system.post ? (
          <PostDetailLayout post={system.post} />
        ) : null}
      </div>
    </div>
  );
}
