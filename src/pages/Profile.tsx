import { useEffect } from "react";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useUserProfile } from "@/features/users/hooks/useUserProfile";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Profile() {
  const { system, actions } = useUserProfile();
  const { fetchMe } = actions;
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <div className="px-4 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Administrá tus datos y la seguridad de tu cuenta.
          </p>
        </header>

        {system.isLoading ? (
          <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
            Cargando perfil...
          </div>
        ) : null}

        {system.error ? (
          <div className="rounded-xl border border-border bg-muted p-4 text-sm">
            {system.error.message}
          </div>
        ) : null}

        {system.successMessage ? (
          <div className="rounded-xl border border-border bg-muted p-4 text-sm">
            {system.successMessage}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Datos */}
          <section className="w-full rounded-2xl bg-card shadow-xl dark:shadow-black/30">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Datos</h2>
                <p className="text-sm text-muted-foreground">
                  Actualizá tu información básica.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Email</label>
                <input
                  value={system.user?.email ?? ""}
                  disabled
                  className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Nombre</label>
                <input
                  value={system.name}
                  onChange={(e) => actions.setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
                {system.nameError ? (
                  <p className="text-sm text-destructive">{system.nameError}</p>
                ) : null}
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={actions.saveName}
                  disabled={system.isSavingName}
                >
                  {system.isSavingName ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section className="w-full rounded-2xl bg-card shadow-xl dark:shadow-black/30">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  Seguridad
                </h2>
                <p className="text-sm text-muted-foreground">
                  Cambiá tu contraseña cuando lo necesites.
                </p>
              </div>

              <div className="space-y-1.5 ">
                <label className="text-sm text-muted-foreground">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={system.showCurrentPassword ? "text" : "password"}
                    value={system.currentPassword}
                    onChange={(e) => actions.setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 pr-12 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />

                  <button
                    type="button"
                    onClick={() => actions.toggleShowCurrentPassword()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {system.showCurrentPassword ? (
                      <MdVisibilityOff />
                    ) : (
                      <MdVisibility />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={system.showNewPassword ? "text" : "password"}
                    value={system.newPassword}
                    onChange={(e) => actions.setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 pr-12 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />

                  <button
                    type="button"
                    onClick={() => actions.toggleShowNewPassword()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {system.showNewPassword ? (
                      <MdVisibilityOff />
                    ) : (
                      <MdVisibility />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={system.showConfirmNewPassword ? "text" : "password"}
                    value={system.confirmNewPassword}
                    onChange={(e) =>
                      actions.setConfirmNewPassword(e.target.value)
                    }
                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 pr-12 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />

                  <button
                    type="button"
                    onClick={() => actions.toggleShowConfirmNewPassword()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {system.showConfirmNewPassword ? (
                      <MdVisibilityOff />
                    ) : (
                      <MdVisibility />
                    )}
                  </button>
                </div>
                {system.passwordError ? (
                  <p className="text-sm text-destructive">
                    {system.passwordError}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={actions.changePassword}
                  disabled={system.isChangingPassword}
                >
                  {system.isChangingPassword
                    ? "Actualizando..."
                    : "Cambiar contraseña"}
                </Button>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">
                    Dar de baja cuenta
                  </div>
                  <p className="mt-1">
                    Esto desactiva tu cuenta y cierra tu sesión. Para
                    reactivarla deberás contactar al administrador.
                  </p>

                  <div className="mt-3 flex justify-end">
                    <Button variant="secondary" onClick={actions.openConfirm}>
                      Dar de baja
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <ConfirmModal
          open={system.confirmOpen}
          message="¿Seguro que querés dar de baja tu cuenta? Vas a perder el acceso hasta que un administrador la reactive."
          confirmText="Sí, dar de baja"
          cancelText="Cancelar"
          isLoading={system.isDeactivating}
          onCancel={actions.closeConfirm}
          onConfirm={actions.deactivateMe}
        />
      </div>
    </div>
  );
}
