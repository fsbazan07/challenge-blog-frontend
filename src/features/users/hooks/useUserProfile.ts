import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeApiError } from "@/services/http/errors";
import { tokenStorage } from "@/services/http/storage";
import { UsersService } from "@/services/users/users.service";
import { AuthService } from "@/services/auth/auth.service";
import type {
  UsersActions,
  UsersSystem,
  UserMe,
} from "@/services/users/users.types";

export function useUserProfile() {
  const navigate = useNavigate();

  // data
  const [user, setUser] = useState<UserMe | null>(null);

  // form
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ui
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [error, setError] = useState<UsersSystem["error"]>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const clearMessage = useCallback(() => {
    setSuccessMessage(null);
    setError(null);
  }, []);

  const hydrate = useCallback((u: UserMe) => {
    console.log("HYDRATE USER:", u);
    setUser(u);
    setName(u.name ?? ""); // si viene null, mostrás vacío
  }, []);

  // actions
  const fetchMe = useCallback(async () => {
    clearMessage();
    setIsLoading(true);
    try {
      const res = await UsersService.me(); // { user }
      console.log("ME RESPONSE:", res);
      hydrate(res);
    } catch (e) {
      console.log("FETCH ME ERROR:", e);
      setError(normalizeApiError(e));
    } finally {
      setIsLoading(false);
    }
  }, [clearMessage, hydrate]);

  const saveName = useCallback(async () => {
    clearMessage();
    setNameError(null);

    const n = name.trim();
    if (!n) return setNameError("El nombre es requerido.");
    if (n.length > 80) return setNameError("Máximo 80 caracteres.");

    setIsSavingName(true);
    try {
      const res = await UsersService.updateMe({ name: n }); // { user }
      hydrate(res);
      setSuccessMessage("Nombre actualizado ✅");
    } catch (e) {
      setError(normalizeApiError(e));
    } finally {
      setIsSavingName(false);
    }
  }, [clearMessage, hydrate, name]);

  const changePassword = useCallback(async () => {
    clearMessage();
    setPasswordError(null);

    if (!currentPassword.trim())
      return setPasswordError("Ingresá tu contraseña actual.");
    if (!newPassword.trim())
      return setPasswordError("Ingresá la nueva contraseña.");
    if (newPassword.length < 6)
      return setPasswordError(
        "La nueva contraseña debe tener al menos 6 caracteres."
      );
    if (newPassword !== confirmNewPassword)
      return setPasswordError("La confirmación no coincide.");
    if (newPassword === currentPassword)
      return setPasswordError(
        "La nueva contraseña debe ser diferente a la actual."
      );

    setIsChangingPassword(true);
    try {
      await UsersService.changePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccessMessage("Contraseña actualizada ✅");
    } catch (e) {
      setError(normalizeApiError(e));
    } finally {
      setIsChangingPassword(false);
    }
  }, [clearMessage, currentPassword, newPassword, confirmNewPassword]);

  const openConfirm = useCallback(() => setConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  // ✅ Dar de baja (fix)
  const deactivateMe = useCallback(async () => {
    clearMessage();
    setIsDeactivating(true);

    try {
      await UsersService.deactivateMe();

      // en tu backend capaz no existe logout => esto NO debería romper
      try {
        await AuthService.logout?.();
      } catch {
        // noop
      }

      tokenStorage.clear();
      navigate("/login", { replace: true });
    } catch (e) {
      setError(normalizeApiError(e));
    } finally {
      setIsDeactivating(false);
      setConfirmOpen(false);
    }
  }, [clearMessage, navigate]);

  const toggleShowCurrentPassword = useCallback(() => {
    setShowCurrentPassword((v) => !v);
  }, []);

  const toggleShowNewPassword = useCallback(() => {
    setShowNewPassword((v) => !v);
  }, []);

  const toggleShowConfirmNewPassword = useCallback(() => {
    setShowConfirmNewPassword((v) => !v);
  }, []);

  const actions: UsersActions = useMemo(
    () => ({
      setName,
      setCurrentPassword,
      setNewPassword,
      setConfirmNewPassword,
      fetchMe,
      saveName,
      changePassword,
      openConfirm,
      closeConfirm,
      deactivateMe,
      clearMessage,
      toggleShowCurrentPassword,
      toggleShowNewPassword,
      toggleShowConfirmNewPassword,
    }),
    [
      fetchMe,
      saveName,
      changePassword,
      openConfirm,
      closeConfirm,
      deactivateMe,
      clearMessage,
      toggleShowCurrentPassword,
      toggleShowNewPassword,
      toggleShowConfirmNewPassword,
    ]
  );

  const system: UsersSystem = useMemo(
    () => ({
      user,
      name,
      currentPassword,
      newPassword,
      confirmNewPassword,
      isLoading,
      isSavingName,
      isChangingPassword,
      isDeactivating,
      error,
      successMessage,
      nameError,
      passwordError,
      confirmOpen,
      showCurrentPassword,
      showNewPassword,
      showConfirmNewPassword,
    }),
    [
      user,
      name,
      currentPassword,
      newPassword,
      confirmNewPassword,
      isLoading,
      isSavingName,
      isChangingPassword,
      isDeactivating,
      error,
      successMessage,
      nameError,
      passwordError,
      confirmOpen,
      showCurrentPassword,
      showNewPassword,
      showConfirmNewPassword,
    ]
  );

  return { system, actions };
}
