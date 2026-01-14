import Button from "@/components/ui/Button";

import type { Props } from "../../../services/posts/post.types";

export default function PostForm({ system, actions }: Props) {
  return (
    <section className="w-full rounded-2xl bg-card shadow-xl dark:shadow-black/30">
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Contenido</h2>
          <p className="text-sm text-muted-foreground">
            Completá los campos para darle forma a tu post.
          </p>
        </div>

        {/* Título */}
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Título *</label>
          <input
            value={system.title}
            onChange={(e) => actions.setTitle(e.target.value)}
            placeholder="Ej: Cómo estructuré mi primer proyecto en NestJS"
            className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          {system.titleError && (
            <p className="text-sm text-destructive">{system.titleError}</p>
          )}
        </div>

        {/* Resumen */}
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Resumen</label>
          <textarea
            value={system.excerpt}
            onChange={(e) => actions.setExcerpt(e.target.value)}
            placeholder="Un resumen corto para el feed (opcional)"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Contenido */}
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Contenido *</label>
          <textarea
            value={system.content}
            onChange={(e) => actions.setContent(e.target.value)}
            placeholder="Escribí tu post acá..."
            rows={10}
            className="w-full resize-none rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          {system.contentError && (
            <p className="text-sm text-destructive">{system.contentError}</p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Tags</label>
          <input
            value={system.tagsInput}
            onChange={(e) => actions.setTagsInput(e.target.value)}
            placeholder="Ej: react, nestjs, typescript (separados por coma)"
            className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          {system.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {system.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => actions.removeTag(t)}
                    className="opacity-70 hover:opacity-100"
                    aria-label={`Quitar tag ${t}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Portada */}
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Portada</label>

          <div
            onDrop={actions.onCoverDrop}
            onDragOver={actions.onCoverDragOver}
            onDragEnter={actions.onCoverDragEnter}
            onDragLeave={actions.onCoverDragLeave}
            className={[
              "relative rounded-2xl border border-dashed border-border",
              "bg-muted/60 p-4 transition-colors",
              system.isDraggingCover ? "ring-2 ring-ring bg-muted" : "",
            ].join(" ")}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Subir imagen de portada"
              onChange={(e) => actions.setCoverFromInput(e.target.files?.[0])}
            />

            <div className="flex flex-col items-center justify-center gap-2 text-center">
              {system.coverPreviewUrl ? (
                <>
                  <img
                    src={system.coverPreviewUrl}
                    alt="Preview portada"
                    className="h-40 w-full rounded-xl object-cover border border-border"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={actions.clearCover}
                    >
                      Quitar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-foreground font-medium">
                    Arrastrá una imagen acá o hacé click para seleccionar
                  </div>
                  <div className="text-xs text-muted-foreground">
                    JPG, PNG o WEBP — máx 5MB
                  </div>
                </>
              )}
            </div>
          </div>

          {system.coverError && (
            <p className="text-sm text-destructive">{system.coverError}</p>
          )}
        </div>

        {/* Actions */}
        {system.mode === "edit" ? (
          <Button
            variant="primary"
            onClick={actions.update}
            disabled={system.isSubmitting}
          >
            {system.isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={actions.saveDraft}>
              Guardar borrador
            </Button>
            <Button variant="primary" onClick={actions.publish}>
              Publicar
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
