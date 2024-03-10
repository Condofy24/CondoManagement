"use client";
import { usePathname } from "next/navigation";
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
            "navItem transition-all hover:text-foreground/80 hover:scale-105",
            pathname.includes("dashboard")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          My Properties
        </Link>
        <Link
          href="/"
          className={cn(
            "navItem transition-all hover:text-foreground/80 hover:scale-105",
            pathname?.includes("/reservation")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Reservations
        </Link>
        <Link
          href="/"
          className={cn(
            "navItem transition-all hover:text-foreground/80 hover:scale-105",
            pathname?.includes("/requests")
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
