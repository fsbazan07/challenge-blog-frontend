import Button from "@/components/ui/Button";
import { resolveCover } from "@/services/posts/posts.assets";
import type { Post } from "@/services/posts/post.types";
import { Link } from "react-router-dom";

type Props = {
  post: Post;
};

export default function PostDetailLayout({ post }: Props) {
  const cover = resolveCover(post.coverUrl);
  const authorName = post.author?.name ?? "—";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      {/* MAIN (nota) */}
      <article className="min-w-0">
        {/* top actions */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="secondary">← Volver</Button>
          </Link>
        </div>

        {/* title + meta */}
        <header className="mt-6 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {post.title}
          </h1>

          <div className="text-sm text-muted-foreground">
            <span>{authorName ? `Por ${authorName}` : "—"}</span>
            {post.created_at ? <span className="mx-2">•</span> : null}
            <span>{post.created_at ?? ""}</span>
          </div>

          {/* excerpt */}
          {post.excerpt ? (
            <p className="text-base sm:text-md text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          ) : null}

          {/* tags (si querés que estén acá en la nota) */}
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.slice(0, 8).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {/* image separada */}
        {cover ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={cover}
              alt=""
              className="h-70 w-full object-cover sm:h-90"
            />
          </div>
        ) : null}

        {/* content */}
        <section className="mt-6">
          <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-base">
            {post.content ?? ""}
          </div>
        </section>
      </article>

      {/* SIDEBAR */}
      <aside className="space-y-6 flex flex-col sm:gap-8 md:gap-0">
        
        

        {/* Tags en este post */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm dark:shadow-black/20">
          <h3 className="text-sm font-semibold text-foreground">Tags en este post</h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {(post.tags ?? []).slice(0, 10).map((t) => (
              <span
                key={t}
                className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
              >
                #{t}
              </span>
            ))}
            {(post.tags ?? []).length === 0 ? (
              <span className="text-sm text-muted-foreground">Sin tags</span>
            ) : null}
          </div>
        </div>

        {/* Top posts (placeholder UI) */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm dark:shadow-black/20">
          <h3 className="text-sm font-semibold text-foreground">¡Te invitamos a crear tus propios posts!</h3>

        

          <div className="mt-4">
            <Link to="/myposts/new" className="block">
              <Button variant="primary" className="w-full">
                Nuevo post
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
