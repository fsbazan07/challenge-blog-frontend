import { ThemeToggle } from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-slate-100" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Blog</p>
              <h1 className="text-lg font-semibold">Challenge Blog</h1>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <section className="md:col-span-2">
            <h2 className="text-xl font-semibold">Últimos posts</h2>

            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((id) => (
                <article
                  key={id}
                  className="rounded-xl border border-slate-200 p-4 shadow-sm dark:border-slate-800"
                >
                  <h3 className="font-semibold">Post #{id}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Preview del contenido… (después lo conectamos a la API)
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="font-semibold">Acciones</h3>
              <button className="mt-3 w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700">
                Crear post
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

