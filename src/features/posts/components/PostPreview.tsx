import type { PostPreviewProps } from "../../../services/posts/post.types";

export default function PostPreview({ system }: PostPreviewProps) {
  return (
    <aside className="w-full rounded-2xl bg-card shadow-xl dark:shadow-black/30">
      <div className="p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Preview</h2>
          <p className="text-sm text-muted-foreground">
            Así se vería en el feed / detalle.
          </p>
        </div>

        {system.coverPreviewUrl ? (
          <img
            src={system.coverPreviewUrl}
            alt="Cover preview"
            className="h-44 w-full rounded-xl object-cover border border-border"
          />
        ) : (
          <div className="h-44 w-full rounded-xl bg-muted border border-border flex items-center justify-center text-sm text-muted-foreground">
            Sin portada
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {system.title?.trim() || "Título del post"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {system.excerpt?.trim() || "Resumen del post (opcional)"}
          </p>

          <div className="pt-2 text-sm text-foreground/90 whitespace-pre-wrap">
            {system.content?.trim()
              ? system.content.slice(0, 500) +
                (system.content.length > 500 ? "..." : "")
              : "Contenido del post..."}
          </div>

          {system.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {system.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
