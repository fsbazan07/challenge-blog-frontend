import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth/auth.service";
import type { ApiError } from "@/services/http/types";

type System = {
  email: string;
  password: string;
  showPassword: boolean;
  remember: boolean;
  isSubmitting: boolean;
  error: string | null;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Completá email y contraseña.");
      }
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
    () => ({ email, password, showPassword, remember, isSubmitting, error }),
    [email, password, showPassword, remember, isSubmitting, error]
  );

  const actions: Actions = useMemo(
    () => ({
      setEmail,
      setPassword,
      toggleShowPassword: () => setShowPassword((s) => !s),
      toggleRemember: () => setRemember((s) => !s),
      submit,
    }),
    [submit]
  );

  return { system, actions };
}
