import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (p: number) => void;
};

function getWindow(page: number, total: number) {
  const delta = 2; // muestra [page-2..page+2]
  const start = Math.max(1, page - delta);
  const end = Math.min(total, page + delta);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return { start, end, pages };
}

export default function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onGoTo,
}: Props) {
  if (totalPages <= 1) return null;

  const { start, end, pages } = getWindow(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className=" px-3 py-2  disabled:opacity-50"
      >
        <MdChevronLeft />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onGoTo(1)}
            className="rounded-xl border border-border bg-muted px-3 py-2 text-sm"
          >
            1
          </button>
          {start > 2 ? (
            <span className="px-1 text-sm text-muted-foreground">…</span>
          ) : null}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onGoTo(p)}
          className={[
            "rounded-xl border px-3 py-2 text-sm",
            p === page
              ? "border-ring bg-background"
              : "border-border bg-muted hover:bg-muted/70",
          ].join(" ")}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 ? (
            <span className="px-1 text-sm text-muted-foreground">…</span>
          ) : null}
          <button
            onClick={() => onGoTo(totalPages)}
            className="rounded-xl border border-border bg-muted px-3 py-2 text-sm"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className=" px-3 py-2  disabled:opacity-50"
      >
        <MdChevronRight />
      </button>
    </div>
  );
}
