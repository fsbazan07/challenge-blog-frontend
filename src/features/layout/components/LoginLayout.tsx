import { Link, Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { ThemeToggle } from "../../../components/ThemeToggle";

export default function LoginLayout() {
  return (
   <div className="relative h-screen ">
      {/* Header flotante arriba */}
      <header className="absolute left-0 top-0 z-20 w-full">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="md:flex items-center gap-2 ">
            <img
              src="/src/assets/MyBlog.png"
              alt="MyBlog"
              className="h-14 drop-shadow-md md:block hidden"
            />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Grid principal */}
      <div className="grid  h-full md:grid-cols-2">
        {/* Columna izquierda: imagen */}
        <div className="relative hidden md:block">
          <img
            src="/src/assets/LoginImage.jpg"
            alt="Login visual"
            className="h-full w-full object-cover"
          />
          {/* overlay suave opcional para que no “grite” */}
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
        </div>

        {/* Columna derecha: contenido */}
        <div className="flex flex-col bg-transparent  h-full">
          {/* spacer para que el header no tape el contenido */}
          <div className="h-16" />

          <main className="flex flex-1 items-center justify-center px-6 ">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
