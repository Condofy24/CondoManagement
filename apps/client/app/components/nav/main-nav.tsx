"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/public/logo.png";

import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-2 md:mr-4 flex">
      <Link
        href="/"
        className="hidden md:flex mr-6 items-center space-x-2 size-10"
      >
        <Image src={logo} alt="website logo" quality={100} objectFit="cover" />
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/property/dashboard"
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
