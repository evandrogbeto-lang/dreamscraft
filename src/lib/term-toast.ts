import { toast as sonnerToast } from "sonner";

const time = () =>
  new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const termToast = {
  success: (msg: string) => sonnerToast.success(`✓ ${msg} · ${time()}`),
  error: (msg: string) => sonnerToast.error(`✗ ${msg}`),
  loading: (msg: string) => sonnerToast.loading(`→ ${msg}...`),
  info: (msg: string) => sonnerToast(`// ${msg}`),
  warning: (msg: string) => sonnerToast.warning(`! ${msg}`),
};
