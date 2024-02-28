"use client";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-2 md:mr-4 flex">
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.includes("dashboard")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Properties
        </Link>
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/docs/components")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Reservations
        </Link>
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/requests")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Requests
        </Link>
      </nav>
    </div>
  );
}
