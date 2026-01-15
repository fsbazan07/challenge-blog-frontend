import Button from "@/components/ui/Button";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;

  confirmText?: string;
  cancelText?: string;

  isLoading?: boolean;

  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCancel}
        className="absolute inset-0 bg-black/50"
      />


      <div className="relative mx-auto flex h-full max-w-lg items-center px-4">
        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
              {cancelText}
            </Button>

            <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "Eliminando..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
