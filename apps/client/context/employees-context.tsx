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

export type EmployeesContextType = {
  employees: Employee[];
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
  refetch: boolean;
  setRefetch: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
};

export const EmployeesContext = createContext<EmployeesContextType>({
  employees: [],
  setEmployees: () => {},
  refetch: false,
  setRefetch: () => {},
  setShowModal: () => {},
  showModal: false,
});

export function EmployeesContextProvider({
  children,
}: EmployeesContextProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        showModal,
        setShowModal,
        setEmployees,
        refetch,
        setRefetch,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
}
