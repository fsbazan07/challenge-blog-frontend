import Button from "@/components/ui/Button";
import PostCard from "@/features/posts/components/PostCard";
import { PostToolbar } from "@/features/posts/components/PostToolbar";

import { Link } from "react-router-dom";

const MOCK_MINE = Array.from({ length: 5 }).map((_, i) => ({
  id: `m-${i + 1}`,
  title: `Mi post #${i + 1}`,
  excerpt: "Mi resumen. En MyPosts podemos mostrar estado y acciones.",
  authorName: "Vos",
  createdAt: "Ayer",
  coverUrl: "",
  tags: ["mi-blog", "dev"],
}));

export default function MyPosts() {
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_MINE.map((p) => (
            <div key={p.id} className="space-y-3">
              <PostCard {...p} />

              {/* acciones (maquetado) */}
              <div className="flex gap-2">
                <Link to={`/posts/${p.id}/edit`} className="w-full">
                  <Button variant="secondary" className="w-full">
                    Editar
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full">
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
