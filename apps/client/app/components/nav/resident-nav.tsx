"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { UserRoles } from "@/types";

export function ResidentNav() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth.value);
  const isOwner = user.role == UserRoles.OWNER;

  return (
    <div className="mr-2 md:mr-4 flex justify-between items-center">
      <nav className="flex items-center gap-2 md:gap-6 text-sm">
        {isOwner ? (
          <Link
            href="/properties"
            className={cn(
              "text-xs navItem transition-all hover:text-foreground/80 hover:scale-105",
              pathname.includes("properties")
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            <span className="hidden md:inline">My</span> Properties
          </Link>
        ) : (
          <Link
            href="/tenant-property"
            className={cn(
              "text-xs navItem transition-all hover:text-foreground/80 hover:scale-105",
              pathname.includes("resident-property")
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            <span className="hidden md:inline">My</span> Property
          </Link>
        )}
        <Link
          href="/reservations"
          className={cn(
            "text-xs navItem transition-all hover:text-foreground/80 hover:scale-105",
            pathname?.includes("/reservations")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Reservations
        </Link>
        <Link
          href="/"
          className={cn(
            "text-xs navItem transition-all hover:text-foreground/80 hover:scale-105",
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
