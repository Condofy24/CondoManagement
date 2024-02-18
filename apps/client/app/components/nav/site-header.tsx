import { MainNav } from "@/app/components/nav/main-nav";
import { ModeToggle } from "../theme/theme-toggle";
import { UserNav } from "./user-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex px-2 h-14 max-w-screen-2xl items-center">
        <MainNav />

        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
            <UserNav />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
