// Tiny formatting utilities shared by every template file - not business
// logic, just string shaping (the same kind of helper opportunity-mapper.ts
// already has privately for its own founder summary).
export function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/\.$/, "");
}

export function sentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
}
