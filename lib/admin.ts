// Only these two emails get admin access, no matter what anyone does.
// Edit this list if an email needs to change.
const ADMIN_EMAILS = [
  "harshsalunke.official@gmail.com",
  "projectskattaofficial@gmail.com"
].map((email) => email.toLowerCase());

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  return ADMIN_EMAILS.includes(email.toLowerCase());
}
