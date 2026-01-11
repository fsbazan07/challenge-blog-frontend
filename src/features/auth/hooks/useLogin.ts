import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth/auth.service";
import type { ApiError } from "@/services/http/types";
import { isEmail } from "@/utils/validation";

type System = {
  email: string;
  password: string;
  showPassword: boolean;
  remember: boolean;
  isSubmitting: boolean;
  error: string | null;
  emailError: string | null;
  passwordError: string | null;
};

type Actions = {
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  toggleShowPassword: () => void;
  toggleRemember: () => void;
  submit: (e?: React.FormEvent) => Promise<void>;
};

export function useLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function validate(): boolean {
    let ok = true;

    const e = email.trim();
    const p = password;

    setEmailError(null);
    setPasswordError(null);

    if (!e) {
      setEmailError("El email es requerido.");
      ok = false;
    } else if (!isEmail(e)) {
      setEmailError("Ingresá un email válido.");
      ok = false;
    }

    if (!p.trim()) {
      setPasswordError("La contraseña es requerida.");
      ok = false;
    } else if (p.length < 8) {
      setPasswordError("Debe tener al menos 8 caracteres.");
      ok = false;
    } else if (p.length > 72) {
      setPasswordError("La contraseña es demasiado larga.");
      ok = false;
    }

    return ok;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    const ok = validate();
    if (!ok) return;

    try {
      const res = await AuthService.login({ email, password });
      AuthService.saveSession(res.accessToken);
      navigate("/feed");
    } catch (err) {
      const apiErr = err as ApiError;
      const msg = Array.isArray(apiErr.message)
        ? apiErr.message.join(", ")
        : apiErr.message;

      setError(msg || "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  const system: System = useMemo(
    () => ({
      email,
      password,
      showPassword,
      remember,
      isSubmitting,
      error,
      emailError,
      passwordError,
    }),
    [
      email,
      password,
      showPassword,
      remember,
      isSubmitting,
      error,
      emailError,
      passwordError,
    ]
  );

  const actions: Actions = useMemo(
    () => ({
      setEmail: (v: string) => {
        setEmail(v);
        if (emailError) setEmailError(null);
        if (error) setError(null);
      },
      setPassword: (v: string) => {
        setPassword(v);
        if (passwordError) setPasswordError(null);
        if (error) setError(null);
      },
      toggleShowPassword: () => setShowPassword((s) => !s),
      toggleRemember: () => setRemember((s) => !s),
      submit,
    }),
    [submit, emailError, passwordError, error]
  );

  return { system, actions };
}
