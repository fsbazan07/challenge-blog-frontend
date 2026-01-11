import type React from "react";
import {
  sanitizeAlphaNumeric,
  sanitizeAlphaNumericSpaces,
  sanitizeEmail,
  sanitizeOnlyLetters,
  sanitizeOnlyNumbers,
  sanitizePassword,
} from "./sanitize";

// Teclas que SI deben permitirse (navegación / edición)
const CONTROL_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Enter",
  "Escape",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

function isCtrlCombo(e: React.KeyboardEvent<HTMLInputElement>) {
  return e.ctrlKey || e.metaKey; // Cmd en Mac
}

function shouldAllowKey(e: React.KeyboardEvent<HTMLInputElement>) {
  if (CONTROL_KEYS.has(e.key)) return true;
  if (isCtrlCombo(e)) return true; // copy/paste/select all
  return false;
}

type Guard = {
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};

// factory helper
function makeGuard(
  isAllowedChar: (c: string) => boolean,
  sanitize: (s: string) => string
): Guard {
  return {
    onKeyDown: (e) => {
      if (shouldAllowKey(e)) return;
      if (e.key.length === 1 && !isAllowedChar(e.key)) {
        e.preventDefault();
      }
    },
    onPaste: (e) => {
      const text = e.clipboardData.getData("text");
      const cleaned = sanitize(text);
      if (cleaned !== text) {
        e.preventDefault();
        const el = e.currentTarget;
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? el.value.length;
        const next = el.value.slice(0, start) + cleaned + el.value.slice(end);
        // asignar el valor y disparar input
        el.value = next;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    },
  };
}

// Guards listos para usar
export const guards = {
  onlyLetters: makeGuard(
    (c) => /[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]/.test(c),
    sanitizeOnlyLetters
  ),
  onlyNumbers: makeGuard((c) => /[0-9]/.test(c), sanitizeOnlyNumbers),
  alphaNumeric: makeGuard((c) => /[A-Za-z0-9]/.test(c), sanitizeAlphaNumeric),
  alphaNumericSpaces: makeGuard(
    (c) => /[A-Za-z0-9\s]/.test(c),
    sanitizeAlphaNumericSpaces
  ),
  email: makeGuard(
    // permitimos caracteres típicos de email
    (c) => /[A-Za-z0-9@._+-]/.test(c),
    sanitizeEmail
  ),
  isPasswordValid: makeGuard(
    (c) => /^[A-Za-z0-9!@#$%^&*()_\-+=\\[\]{}|;:,.?/]$/.test(c),
    sanitizePassword
  ),
};
