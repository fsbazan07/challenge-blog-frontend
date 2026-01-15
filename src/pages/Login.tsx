import LoginForm from "../features/auth/componets/LoginForms";
import mylogo from "@/assets/MyBlog.png";

export default function Login() {
  return (
    <div className="w-full flex flex-col  justify-center items-center relative">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-center flex flex-col justify-center gap-4">
          <img
            src={mylogo}
            alt="Challenge Blog"
            className="mx-auto h-20"
          />
          <h1 className="text-2xl font-semibold">Bienvenido</h1>

          <p className="text-md text-muted-foreground p-5">
            Publicá tus ideas, documentá tus aprendizajes y mostrale al mundo lo
            que sabés construir.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
