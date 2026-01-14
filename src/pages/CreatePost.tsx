import PostForm from "@/features/posts/components/PostForm";
import PostPreview from "@/features/posts/components/PostPreview";
import { usePostForm } from "@/features/posts/hooks/usePostForm";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CreatePost() {
  const { system, actions } = usePostForm();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (id) actions.loadForEdit(id);
    console.log("ID del post a editar:", id);
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-2">
          <h1>{system.mode === "edit" ? "Editar post" : "Crear post"}</h1>
          <p className="text-sm text-muted-foreground">
            Escribí tu idea, guardala como borrador o publicala cuando esté
            lista.
          </p>
        </header>
         {system.isLoading ? <div>cargando...</div> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <PostForm system={system} actions={actions} />
          <PostPreview system={system}  />
        </div>
      </div>
    </div>
  );
}
