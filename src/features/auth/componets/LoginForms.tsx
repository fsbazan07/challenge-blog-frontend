import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useLogin } from "../hooks/useLogin";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function LoginForm() {
  const { system, actions } = useLogin();

  return (
    <div className="flex items-center justify-center px-4 py-5 w-full gap-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl dark:shadow-black/30">
        <div className="p-6 sm:p-8">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
            Iniciar sesión
          </h1>

          <form className="mt-6 space-y-4 flex flex-col gap-4" onSubmit={actions.submit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <input
                value={system.email}
                onChange={(e) => actions.setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                Contraseña
              </label>
              <div className="relative">
                <input
                  value={system.password}
                  onChange={(e) => actions.setPassword(e.target.value)}
                  type={system.showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={system.remember}
                onChange={actions.toggleRemember}
                className="h-4 w-4 rounded border-border"
              />
              Recordarme
            </label>

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
              {system.isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <div className="pt-2 text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Crear una cuenta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
