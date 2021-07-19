import Dayjs from "../helpers/dayjs";
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

export type InvestmentsSummary = Array<{
  type : InvestmentType;
  sum : number;
}>;

export class InvestmentsService {
  private static investmentsPath = "/investments";
  private static investmentsSummaryPath = "/investmentsSummary";

  public static displayableInvestmentType(type : InvestmentType) : string {
    switch(type) {
    case "FIXED":
      return "Fixed";
    
    case "VARIABLE":
      return "Variable";
    }
  }

  private static normalizeInvestmentDate(investment : Investment) : Investment {
    //Investment date is treated as ISO Date
    //but we want them to be treated as YYYY-MM-DD

    return {
      ...investment
      // date: Dayjs.utc(investment.date).format("YYYY-MM-DD")
    };
  }

  public static async getInvestments(query ?: GetInvestmentsQuery) : Promise<PaginatedData<Investment>> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: this.investmentsPath,
      method: "GET",
      params: query
    });

    const investments = response.data.data as Array<Investment>;
    const normalizedInvesments = investments
      .map(investment => this.normalizeInvestmentDate(investment));

    return {
      data: normalizedInvesments,
      meta: response.data.meta
    };
  }

  public static async getInvestmentById(id : string) : Promise<Investment> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsPath}/${id}`,
      method: "GET"
    });

    return this.normalizeInvestmentDate(response.data);
  }

  public static async createInvestment(investment : CreateInvestmentData) : Promise<Investment> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsPath}`,
      method: "POST",
      data: investment
    });

    return this.normalizeInvestmentDate(response.data);
  }

  public static async updateInvestment(id : string, investment : UpdateInvestmentData) : Promise<Investment> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsPath}/${id}`,
      method: "PUT",
      data: investment
    });

    return this.normalizeInvestmentDate(response.data);
  }

  public static async deleteInvestment(id : string) : Promise<Investment> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsPath}/${id}`,
      method: "DELETE"
    });

    return this.normalizeInvestmentDate(response.data);
  }

  public static async getInvestmentsSummary() : Promise<InvestmentsSummary> {
    const baseClient = await BaseAPIService.getClient();
    const response = await baseClient.request({
      url: `${this.investmentsSummaryPath}`,
      method: "GET"
    });

    return response.data;
  }
}