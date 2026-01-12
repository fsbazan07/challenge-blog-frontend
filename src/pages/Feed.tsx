import Button from "@/components/ui/Button";
import PostCard from "@/features/posts/components/PostCard";
import { PostToolbar } from "@/features/posts/components/PostToolbar";

import { Link } from "react-router-dom";

const MOCK = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  title: `Post de ejemplo #${i + 1}`,
  excerpt: "Una breve descripción del post para el feed. Dos líneas máximo.",
  authorName: "Florencia",
  createdAt: "Hoy",
  coverUrl: "",
  tags: ["react", "nestjs", "typescript"],
}));

export default function Feed() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <PostToolbar
          title="Feed"
          subtitle="Explorá posts de la comunidad y descubrí nuevas ideas."
          rightSlot={
            <Link to="/posts/new">
              <Button variant="primary">Crear post</Button>
            </Link>
          }
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Buscar por título, tags..."
            className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />

          <select className="w-full sm:w-56 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
            <option>Más recientes</option>
            <option>Más populares</option>
          </select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK.map((p) => (
            <PostCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
}
