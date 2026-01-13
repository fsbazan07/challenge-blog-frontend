import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import PostCard from "@/features/posts/components/PostCard";
import { PostToolbar } from "@/features/posts/components/PostToolbar";
import { useMyPosts } from "@/features/posts/hooks/useMyPosts";
import { resolveCover } from "@/services/posts/posts.assets";

import { Link } from "react-router-dom";

export default function MyPosts() {
  const { system, actions } = useMyPosts();
  return (
    <div className="px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <PostToolbar
          title="Mis posts"
          subtitle="Creá, editá y administrá tu contenido."
          rightSlot={
            <Link to="/posts/new">
              <Button variant="primary">Crear post</Button>
            </Link>
          }
        />
        {system.isLoading ? (
          <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
            Cargando tus posts...
          </div>
        ) : null}

        {system.error ? (
          <div className="rounded-xl border border-border bg-muted p-4 text-sm">
            {system.error.message}
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {system.items.map((p) => (
            <div key={p.id} className="space-y-3">
              <PostCard
                key={p.id}
                id={p.id}
                title={p.title}
                excerpt={p.excerpt ?? ""}
                authorName={p.author?.name ?? "—"}
                createdAt={p.created_at}
                coverUrl={resolveCover(p.coverUrl) ?? ""}
                tags={p.tags ?? []}
              />

              {/* acciones (maquetado) */}
              <div className="flex gap-2">
                <Link to={`/posts/${p.id}/edit`} className="w-full">
                  <Button variant="secondary" className="w-full">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => actions.openConfirm(p.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
        {!system.isLoading && !system.error && system.items.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted p-6 text-sm text-muted-foreground">
            Todavía no tenés posts. Creá el primero ✍️
          </div>
        ) : null}
        <Pagination
          page={system.page}
          totalPages={system.totalPages}
          onPrev={actions.prevPage}
          onNext={actions.nextPage}
          onGoTo={actions.goToPage}
        />
        <ConfirmModal
          open={system.confirmOpen}
          message="¿Estás seguro que querés eliminar este post?"
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          isLoading={system.isDeleting}
          onCancel={actions.closeConfirm}
          onConfirm={actions.deletePost}
        />
      </div>
    </div>
  );
}
