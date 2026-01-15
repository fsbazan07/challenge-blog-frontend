import { formatAR } from "@/utils/helpers/dateFormat";
import { Link } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  excerpt?: string | null;
  authorName?: string | null;
  createdAt?: string | null | Date;
  coverUrl?: string | null;
  tags?: string[];

  status?: "draft" | "published";
  showStatus?: boolean;
};

export default function PostCard({
  id,
  title,
  excerpt,
  authorName,
  createdAt,
  coverUrl,
  tags = [],
  status,
  showStatus = false,
}: Props) {
  return (
    <article className=" relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:shadow-black/20">
      {showStatus && status && (
        <span
          className={[
            "absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-medium",
            "backdrop-blur bg-black/40 text-white",
            status === "published"
              ? "ring-1 ring-emerald-400/40"
              : "ring-1 ring-amber-400/40",
          ].join(" ")}
        >
          {status === "published" ? "Publicado" : "Borrador"}
        </span>
      )}
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
          <span>{formatAR(createdAt as string)}</span>
        </div>
      </div>
    </article>
  );
}
