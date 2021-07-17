export type InvestmentType = "VARIABLE" | "FIXED";

export interface Investment {
  id : string;
  identifier : string;
  type : InvestmentType;
  value : number;
  date : string;
}

export class InvestmentsService {
  public static displayableInvestmentType(type : InvestmentType) : string {
    switch(type) {
    case "FIXED":
      return "Fixed";
    
    case "VARIABLE":
      return "Variable";
    }
  }
}