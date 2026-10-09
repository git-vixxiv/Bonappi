// Accepts "(512) 555-0100", "512-555-0100" or "+15125550100"; US numbers only for the pilot
export function normalizePhone(input) {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}
