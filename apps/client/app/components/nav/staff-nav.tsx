"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";

export function StaffNav() {
  const pathname = usePathname();
  const { admin } = useAppSelector((state) => state.auth.value);

  const isManager = admin?.role == 0;

  return (
    <div className="mr-2 md:mr-4 flex">
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href="/dashboard"
          className={cn(
            "navItem transition-all hover:text-foreground/80 hover:scale-105",
            pathname.includes("dashboard")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Property <span className="hidden md:inline">Dashboard</span>
        </Link>
        {isManager && (
          <Link
            href="/employees"
            className={cn(
              "navItem transition-all hover:text-foreground/80 hover:scale-105",
              pathname.includes("dashboard")
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            <span className="hidden md:inline">Manage</span> Employees
          </Link>
        )}
        <Link
          href="/requests"
          className={cn(
            "navItem transition-all hover:text-foreground/80 hover:scale-105",
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
