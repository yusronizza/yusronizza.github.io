import type { ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "border border-border text-foreground hover:border-accent hover:text-accent",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors";

export function LinkButton({
  href,
  variant = "primary",
  children,
  external = false,
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  external?: boolean;
}) {
  const className = `${baseClasses} ${variantClasses[variant]}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Button({
  onClick,
  variant = "primary",
  children,
  className = "",
}: {
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
