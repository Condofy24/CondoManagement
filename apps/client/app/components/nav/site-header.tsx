"use client";
import { ResidentNav } from "@/app/components/nav/resident-nav";
import { ModeToggle } from "../theme/theme-toggle";
import { UserNav } from "./user-nav";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { StaffNav } from "./staff-nav";

export function SiteHeader() {
  const { loggedIn, admin } = useAppSelector((state) => state.auth.value);
  const router = useRouter();

  const isStaff = !!admin?.companyId;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex px-2 h-14 items-center">
        <button
          onClick={() => router.push("/")}
          className="hidden md:flex mr-6 items-center space-x-2 size-10"
        >
          <Image
            src={logo}
            alt="website logo"
            quality={100}
            objectFit="cover"
          />
        </button>
        {!loggedIn ? (
          <div className="flex flex-row gap-4">
            <Link
              className="navItem transition-all hover:text-foreground/80 hover:scale-105"
              href="/login"
            >
              Join us today
            </Link>
          </div>
        ) : isStaff ? (
          <StaffNav />
        ) : (
          <ResidentNav />
        )}

        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
            {loggedIn && <UserNav />}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
