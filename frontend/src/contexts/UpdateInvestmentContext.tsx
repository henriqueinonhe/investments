import React from "react";
import { Investment } from "../services/InvestmentsService";

export interface UpdateInvestmentContextData {
  investmentToBeUpdated ?: Investment;
  setInvestmentToBeUpdated : React.Dispatch<React.SetStateAction<Investment | undefined>>;
}

export const UpdateInvestmentContext = React.createContext<UpdateInvestmentContextData>({
  investmentToBeUpdated: undefined,
  setInvestmentToBeUpdated: () => { /* */ }
});