import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useRegister } from "../hooks/useRegister";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { guards } from "@/utils/validation";

export default function RegisterForm() {
  const { system, actions } = useRegister();

  return (
    <div className="flex items-center justify-center px-4 py-5 w-full gap-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl dark:shadow-black/30">
        <div className="p-6 sm:p-8">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
            Crear cuenta
          </h1>

          <form
            className="mt-6 space-y-4 flex flex-col gap-4"
            onSubmit={actions.submit}
          >
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Nombre</label>
              <input
                value={system.name}
                {...guards.onlyLetters}
                onChange={(e) => actions.setName(e.target.value)}
                type="text"
                autoComplete="name"
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              {system.nameError && (
                <p className="text-sm text-destructive">{system.nameError}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <input
                value={system.email}
                {...guards.email}
                onChange={(e) => actions.setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              {system.emailError && (
                <p className="text-sm text-destructive">{system.emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                Contraseña
              </label>
              <div className="relative">
                <input
                  value={system.password}
                  {...guards.isPasswordValid}
                  onChange={(e) => actions.setPassword(e.target.value)}
                  type={system.showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-muted px-4 py-3 pr-12 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={actions.toggleShowPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                  aria-label="Mostrar contraseña"
                >
                  {system.showPassword ? (
                    <MdVisibilityOff className="h-5 w-5" />
                  ) : (
                    <MdVisibility className="h-5 w-5" />
                  )}
                </button>
              </div>
              {system.passwordError && (
                <p className="text-sm text-destructive">
                  {system.passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  value={system.confirmPassword}
                  onChange={(e) => actions.setConfirmPassword(e.target.value)}
                  type={system.showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...guards.isPasswordValid}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-muted px-4 py-3 pr-12 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={actions.toggleShowConfirmPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                  aria-label="Mostrar contraseña"
                >
                  {system.showConfirmPassword ? (
                    <MdVisibilityOff className="h-5 w-5" />
                  ) : (
                    <MdVisibility className="h-5 w-5" />
                  )}
                </button>
              </div>
              {system.confirmPasswordError && (
                <p className="text-sm text-destructive">
                  {system.confirmPasswordError}
                </p>
              )}
            </div>

            {system.error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {system.error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={system.isSubmitting}
            >
              {system.isSubmitting ? "Creando..." : "Crear cuenta"}
            </Button>

            <div className="pt-2 text-center text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
