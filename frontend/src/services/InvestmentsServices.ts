import { PaginatedData } from "../helpers/utils";
import { BaseAPIService } from "./BaseAPIService";

export type InvestmentType = "VARIABLE" | "FIXED";

export interface Investment {
  id : string;
  identifier : string;
  type : InvestmentType;
  value : number;
  date : string;
}

export type CreateInvestmentData = Omit<Investment, "id">;

export type UpdateInvestmentData = CreateInvestmentData;

export interface GetInvestmentsQuery {
  identifier ?: string;
  types ?: Array<InvestmentType>;
  startDate ?: string;
  endDate ?: string;
  page ?: number;
  perPage ?: number;
}

export class InvestmentsService {
  private static investmentsPath = "/investments";

  public static displayableInvestmentType(type : InvestmentType) : string {
    switch(type) {
    case "FIXED":
      return "Fixed";
    
    case "VARIABLE":
      return "Variable";
    }
  }

  public static async getInvestments(query ?: GetInvestmentsQuery) : Promise<PaginatedData<Investment>> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: this.investmentsPath,
      method: "GET",
      params: query
    });

    return response.data;
  }

  public static async getInvestmentById(id : string) : Promise<Investment> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsPath}/${id}`,
      method: "GET"
    });

    return response.data;
  }

  public static async createInvestment(investment : CreateInvestmentData) : Promise<Investment> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsPath}`,
      method: "POST",
      data: investment
    });

    return response.data;
  }

  public static async updateInvestment(id : string, investment : UpdateInvestmentData) : Promise<Investment> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsPath}/${id}`,
      method: "PUT",
      data: investment
    });

    return response.data;
  }

  public static async deleteInvestment(id : string) : Promise<Investment> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsPath}/${id}`,
      method: "DELETE"
    });

    return response.data;
  }
}