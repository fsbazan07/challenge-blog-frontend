import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import PostCard from "@/features/posts/components/PostCard";
import { PostToolbar } from "@/features/posts/components/PostToolbar";
import { useFeedPosts } from "@/features/posts/hooks/useFeedPosts";
import { resolveCover } from "@/services/posts/posts.assets";

import { Link } from "react-router-dom";

export default function Feed() {
  const { system, actions } = useFeedPosts();
  return (
    <div className="px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <PostToolbar
          title="Feed"
          subtitle="Explorá posts de la comunidad y descubrí nuevas ideas."
          rightSlot={
            <Link to="/myposts/new">
              <Button variant="primary">Crear post</Button>
            </Link>
          }
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Buscar por título, tags..."
            value={system.q}
            onChange={(e) => actions.setQ(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />

          <select
            onChange={() => {
              // TODO: implementar mas populares / más recientes en backend
            }}
            className="w-full sm:w-56 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Más recientes</option>
            <option>Más populares</option>
          </select>
        </div>
        {system.error ? (
          <div className="rounded-xl border border-border bg-muted p-4 text-sm">
            {system.error.message}
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {system.items.map((p) => (
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
          ))}
        </div>
        <Pagination
          page={system.page}
          totalPages={system.totalPages}
          onPrev={actions.prevPage}
          onNext={actions.nextPage}
          onGoTo={actions.goToPage}
        />

        {/* opcional: loader */}
        {system.isLoading ? (
          <div className="text-sm text-muted-foreground">Cargando...</div>
        ) : null}
      </div>
    </div>
  );
}
