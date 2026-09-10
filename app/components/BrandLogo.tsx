import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ compact = false, priority = false }: { compact?: boolean; priority?: boolean }) {
  return (
    <Link href="/" className={`brand-logo ${compact ? "brand-logo-compact" : ""}`} aria-label="OSYSTIC home">
      <Image
        src="/brand/osystic-logo.png"
        alt="OSYSTIC"
        width={4096}
        height={992}
        sizes={compact ? "172px" : "(max-width: 640px) 158px, 184px"}
        priority={priority}
        className="brand-logo-image"
      />
    </Link>
  );
}
