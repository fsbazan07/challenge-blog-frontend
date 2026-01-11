import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth/auth.service";
import type { ApiError } from "@/services/http/types";
import { isEmail, isPasswordValid } from "@/utils/validation";

type System = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;

  isSubmitting: boolean;
  error: string | null;

  nameError: string | null;
  emailError: string | null;
  passwordError: string | null;
  confirmPasswordError: string | null;
};

type Actions = {
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
  submit: (e?: React.FormEvent) => Promise<void>;
};

export function useRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  function validate(): boolean {
    let ok = true;

    const n = name.trim();
    const e = email.trim();
    const p = password;
    const cp = confirmPassword;

    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!n) {
      setNameError("El nombre es requerido.");
      ok = false;
    } else if (n.length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres.");
      ok = false;
    } else if (n.length > 60) {
      setNameError("El nombre es demasiado largo.");
      ok = false;
    }

    if (!e) {
      setEmailError("El email es requerido.");
      ok = false;
    } else if (!isEmail(e)) {
      setEmailError("Ingresá un email válido.");
      ok = false;
    }

    const pwdError = isPasswordValid(p);
    if (!pwdError) {
      setPasswordError("La contraseña no es válida.");
      ok = false;
    }

    if (!cp.trim()) {
      setConfirmPasswordError("Confirmá tu contraseña.");
      ok = false;
    } else if (cp !== p) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      ok = false;
    }

    return ok;
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    const ok = validate();
    if (!ok) return;

    setIsSubmitting(true);

    try {
      const res = await AuthService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res?.accessToken) {
        AuthService.saveSession(res.accessToken);
        navigate("/feed");
        return;
      }

      navigate("/login");
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
      name,
      email,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      isSubmitting,
      error,
      nameError,
      emailError,
      passwordError,
      confirmPasswordError,
    }),
    [
      name,
      email,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      isSubmitting,
      error,
      nameError,
      emailError,
      passwordError,
      confirmPasswordError,
    ]
  );

  const actions: Actions = useMemo(
    () => ({
      setName,
      setEmail,
      setPassword,
      setConfirmPassword,
      toggleShowPassword: () => setShowPassword((s) => !s),
      toggleShowConfirmPassword: () => setShowConfirmPassword((s) => !s),
      submit,
    }),
    [submit, error, nameError, emailError, passwordError]
  );

  return { system, actions };
}
