import { Link, NavLink } from "react-router-dom";
import { useHeader } from "../hooks/useHeader";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { MdMenu } from "react-icons/md";
import Button from "../../../components/ui/Button";

export default function Header() {
  const { system, actions } = useHeader();

  return (
    <header
      className="sticky top-0 z-20 
         shadow-md
        
        dark:shadow-accent
      
        bg-background backdrop-blur"
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.toggleMobileMenu}
            className="md:hidden"
            aria-label="Abrir menú"
            aria-expanded={system.isMobileMenuOpen}
          >
            <MdMenu />
          </Button>

          <Link to="/feed" className="text-sm font-semibold tracking-tight">
            <img
              src="src/assets/MyBlog.png"
              alt="MyBlog"
              className="h-16 drop-shadow-md"
            />
          </Link>
        </div>

        {/* Center (desktop nav) */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: "/feed", label: "Feed" },
            { to: "/myposts", label: "Mis posts" },
            { to: "/profile", label: "Perfil" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "relative rounded-md px-3 py-2 text-sm transition-colors",
                  "text-foreground hover:bg-muted",
                  isActive && "bg-muted font-medium",
                ].join(" ")
              }
            >
              {item.label}

              {/* underline animado */}
              <span
                className={`
          absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2
          rounded-full bg-primary transition-all
          group-hover:w-4
        `}
              />
            </NavLink>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block p-0.5">
            <ThemeToggle />
          </div>

          {system.isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={actions.onLogoutClick}>
              Salir
            </Button>
          ) : (
            <Link to="/login" onClick={actions.closeMobileMenu}>
              <Button variant="outline" size="sm">
                Ingresar
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {system.isMobileMenuOpen && (
        <div className="bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            <Link
              to="/feed"
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={actions.closeMobileMenu}
            >
              Feed
            </Link>
            <Link
              to="/myposts"
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={actions.closeMobileMenu}
            >
              Mis posts
            </Link>
            <Link
              to="/profile"
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={actions.closeMobileMenu}
            >
              Perfil
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      )}
    </header>
  );
}
