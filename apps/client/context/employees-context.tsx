import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { Employee } from "@/types";

type EmployeesContextProviderProps = {
  children: React.ReactNode;
};

type EmployeesContextType = {
  employees: Employee[];
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
  refetch: boolean;
  setRefetch: Dispatch<SetStateAction<boolean>>;
};

export const EmployeesContext = createContext<EmployeesContextType>({
  employees: [],
  setEmployees: () => {},
  refetch: false,
  setRefetch: () => {},
});

export function EmployeesContextProvider({
  children,
}: EmployeesContextProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [refetch, setRefetch] = useState(false);

  return (
    <EmployeesContext.Provider
      value={{ employees, setEmployees, refetch, setRefetch }}
    >
      {children}
    </EmployeesContext.Provider>
  );
}
