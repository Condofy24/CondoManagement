"use client";

import { SectionName } from "@/types";
import { useState, createContext, useContext } from "react";

type ActiveSectionContextProps = {
  children: React.ReactNode;
};

type ActiveSectionContextType = {
  activeSection: SectionName;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
  timeOfLastClick: number;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
} | null;

export const ActiveSectionContext =
  createContext<ActiveSectionContextType>(null);

export default function ActiveSectionContextProvider({
  children,
}: ActiveSectionContextProps) {
  const [activeSection, setActiveSection] = useState<SectionName>("Home");
  const [timeOfLastClick, setTimeOfLastClick] = useState<number>(0);

  return (
    <ActiveSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
      }}
    >
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSectionContext() {
  const activeSectionContext = useContext(ActiveSectionContext);

  if (activeSectionContext === null) {
    throw new Error(
      "useActiveSectionContext must be used within ActiveSectionContextProvider",
    );
  }

  return activeSectionContext;
}
