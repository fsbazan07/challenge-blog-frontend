import { Link } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  excerpt?: string | null;
  authorName?: string | null;
  createdAt?: string | null;
  coverUrl?: string | null;
  tags?: string[];
};

export default function PostCard({
  id,
  title,
  excerpt,
  authorName,
  createdAt,
  coverUrl,
  tags = [],
}: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:shadow-black/20">
      {coverUrl ? (
        <img src={coverUrl} alt="" className="h-44 w-full object-cover" />
      ) : (
        <div className="h-44 w-full bg-muted" />
      )}

      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <Link to={`/posts/${id}`} className="block">
            <h3 className="text-lg font-semibold text-foreground hover:underline">
              {title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {excerpt || "Sin resumen"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 6).map((t) => (
            <span
              key={t}
              className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
            >
              #{t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{authorName ? `Por ${authorName}` : "—"}</span>
          <span>{createdAt || ""}</span>
        </div>
      </div>
    </article>
  );
}
