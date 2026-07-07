import { getEmailAddress, getMailtoHref } from '@/lib/email';

type EmailLinkProps = {
  className?: string;
  showIcon?: boolean;
};

export function EmailLink({ className = '' }: EmailLinkProps) {
  const address = getEmailAddress();
  return (
    <a href={getMailtoHref()} className={className}>
      {address}
    </a>
  );
}