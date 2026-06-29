import { formatPhoneDisplay, formatPhoneLink } from '@/lib/utils';

export function PhoneLink({ phone, className = '' }: { phone?: string | number; className?: string }) {
  const tel = formatPhoneLink(phone);
  const display = formatPhoneDisplay(phone);
  if (!tel || display === '–') {
    return <span className={`text-[#635241] ${className}`}>–</span>;
  }
  return (
    <a href={tel} className={`text-[#D4854A] hover:underline font-medium whitespace-nowrap ${className}`}>
      {display}
    </a>
  );
}