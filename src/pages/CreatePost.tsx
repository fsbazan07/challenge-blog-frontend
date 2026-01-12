import PostForm from "@/features/posts/components/PostForm";
import PostPreview from "@/features/posts/components/PostPreview";
import { usePostForm } from "@/features/posts/hooks/usePostForm";

export default function CreatePost() {
  const { system, actions } = usePostForm();
  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Crear post</h1>
          <p className="text-sm text-muted-foreground">
            Escribí tu idea, guardala como borrador o publicala cuando esté
            lista.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <PostForm system={system} actions={actions} />
          <PostPreview system={system} />
        </div>
      </div>
    </div>
  );
}
