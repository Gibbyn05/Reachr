export const ADMIN_EMAILS = [
  "fredriik8@gmail.com",
  "fredrik.nerlandsrem@gmail.com",
  "kristijonas.sta@gmail.com",
];

export const FREE_EMAILS = [
  "emil.silseth@gmail.com",
  "testbruker@reachr.no",
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/** Users who get free access but not admin rights */
export function isFreeUser(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return ADMIN_EMAILS.includes(normalized) || FREE_EMAILS.includes(normalized);
}
