/** Split storage reduces plaintext email harvesting in HTML source. */
const EMAIL_LOCAL = 'dunakeszimasszor';
const EMAIL_HOST = 'gmail.com';

export function getEmailAddress(): string {
  return `${EMAIL_LOCAL}@${EMAIL_HOST}`;
}

export function getMailtoHref(): string {
  return `mailto:${getEmailAddress()}`;
}