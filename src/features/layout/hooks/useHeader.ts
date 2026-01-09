import { useMemo, useState } from "react";

export function useHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const system = useMemo(
    () => ({
      isMobileMenuOpen,
      // placeholders: cuando tengamos auth real, esto vendrá del contexto/store
      isAuthenticated: false,
      userName: "",
    }),
    [isMobileMenuOpen]
  );

  const actions = useMemo(
    () => ({
      toggleMobileMenu: () => setIsMobileMenuOpen((v) => !v),
      closeMobileMenu: () => setIsMobileMenuOpen(false),
      // placeholders para wiring futuro
      onLoginClick: () => {},
      onLogoutClick: () => {},
    }),
    []
  );

  return { system, actions };
}
