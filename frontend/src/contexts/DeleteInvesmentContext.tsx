import React from "react";
import { Investment } from "../services/InvestmentsService";

export interface DeleteInvestmentContextData {
  investmentToBeDeleted ?: Investment;
  setInvestmentToBeDeleted : React.Dispatch<React.SetStateAction<Investment | undefined>>;
}

export const DeleteInvestmentContext = React.createContext<DeleteInvestmentContextData>({
  investmentToBeDeleted: undefined,
  setInvestmentToBeDeleted: () => { /* */ }
});