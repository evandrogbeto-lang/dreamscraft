/**
 * Contatos oficiais Dreamscraft.Code.
 * Fonte do WhatsApp: número já usado pelo botão global (`WhatsAppButton`).
 * Confirmado pelo projeto: 5561991748651.
 */
export const WHATSAPP_PHONE_E164 = "5561991748651";

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE_E164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
