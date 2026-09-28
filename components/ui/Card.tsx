import Link from "next/link";

const base = "block rounded-[18px] border border-line bg-white p-[clamp(18px,2vw,24px)]";

/** Carte publique. Avec `href`, toute la carte est un <a> : filet noir et levée de 2px au survol (README §5.6). */
export function Card({
  href,
  className = "",
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className={`${base} ${className}`}>{children}</div>;
  return (
    <Link
      href={href}
      className={`${base} text-ink-900 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-900 ${className}`}
    >
      {children}
    </Link>
  );
}
