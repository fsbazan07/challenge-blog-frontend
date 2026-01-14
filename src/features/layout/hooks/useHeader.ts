import { AuthService } from "@/services/auth/auth.service";
import { tokenStorage } from "@/services/http/storage";
import { UsersService } from "@/services/users/users.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchMe = useCallback(async () => {
    // si no hay token, no estás logueado
    const token = tokenStorage.getAccess?.(); // si tu tokenStorage usa otro método, ajustá acá
    if (!token) {
      setIsAuthenticated(false);
      setUserName("");
      return;
    }

    try {
      const u = await UsersService.me(); // devuelve UserMe
      setIsAuthenticated(true);
      setUserName(u.name ?? u.email ?? "");
    } catch {
      // token inválido / expirado
      tokenStorage.clear();
      setIsAuthenticated(false);
      setUserName("");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout?.();
    } catch {
      // noop
    }
    tokenStorage.clear();
    setIsAuthenticated(false);
    setUserName("");
    navigate("/login", { replace: true });
  }, [navigate]);

  const system = useMemo(
    () => ({
      isMobileMenuOpen,
      isAuthenticated,
      userName,
    }),
    [isMobileMenuOpen, isAuthenticated, userName]
  );
  
  const actions = useMemo(
    () => ({
      toggleMobileMenu: () => setIsMobileMenuOpen((v) => !v),
      closeMobileMenu: () => setIsMobileMenuOpen(false),
      // placeholders para wiring futuro
      onLoginClick: () => {},
      fetchMe,
      onLogoutClick: logout,
    }),
    [fetchMe, logout]
  );

  return { system, actions };
}
