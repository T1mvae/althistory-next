import Image from 'next/image';
import { coverStyle } from '@/lib/style';

/** Universe cover: real Notion image if present, else the engraved-atlas placeholder. */
export function Cover({
  hue,
  src,
  alt,
  className,
  children,
}: {
  hue: number;
  src?: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className || ''}`} style={!src ? coverStyle(hue) : undefined}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="(max-width:768px) 100vw, 380px" className="object-cover" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(201,164,92,.10) 0 1px, transparent 1px 11px)',
          }}
        />
      )}
      {children}
    </div>
  );
}
