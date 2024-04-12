import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { RequestUpdateData } from "@/actions/resident-actions";

type RequestContextProviderProps = {
  children: React.ReactNode;
};

export type RequestContextType = {
  req: RequestUpdateData;
  setReq: Dispatch<SetStateAction<RequestUpdateData>>;
  refetch: boolean;
  setRefetch: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
};

export const RequestContext = createContext<RequestContextType>({
  req: {} as RequestUpdateData,
  setReq: () => {},
  refetch: false,
  setRefetch: () => {},
  setShowModal: () => {},
  showModal: false,
});

export function RequestContextProvider({
  children,
}: RequestContextProviderProps) {
  const [req, setReq] = useState<RequestUpdateData>({} as RequestUpdateData);
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <RequestContext.Provider
      value={{
        req,
        showModal,
        setShowModal,
        setReq,
        refetch,
        setRefetch,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}
