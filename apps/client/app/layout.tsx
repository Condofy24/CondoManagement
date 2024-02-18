import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeContextProvider from "@/context/theme-context";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import { SiteHeader } from "./components/nav/site-header";

export const metadata: Metadata = {
  title: "Condofy",
  description: "Condo management made easy",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-primary text-primary dark:text-opacity-90",
          fontSans.variable,
        )}
      >
        <ActiveSectionContextProvider>
          <ThemeContextProvider>
            <SiteHeader />
            <Toaster position="top-right" />

            <ReduxProvider>{children}</ReduxProvider>
          </ThemeContextProvider>
        </ActiveSectionContextProvider>
      </body>
    </html>
  );
}
