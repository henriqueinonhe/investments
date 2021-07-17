import { Investment, InvestmentType } from "../entities/Investment";
import { ValidationError, ValidationErrorEntry } from "../exceptions/ValidationError";
import { InvestmentsRepository } from "../repositories/InvestmentsRepository";
import { capitalize, merge } from "lodash";
import { Between, getCustomRepository, ILike, In } from "typeorm";
import { defaults } from "lodash";
import { computeLastPage, defaultEndDate, defaultStartDate, PaginatedEntity } from "../helpers/utils";

export interface CreateInvestmentData {
  identifier ?: string;
  type ?: InvestmentType;
  value ?: number;
  date ?: Date;
}

export interface GetInvestmentsQuery {
  identifier ?: string;
  types ?: Array<InvestmentType>;
  startDate ?: string;
  endDate ?: string;
  page ?: number;
  perPage ?: number;
}

export type UpdateInvestmentData = CreateInvestmentData;

export class InvestmentsService {
  public static async createInvestment(investment : CreateInvestmentData) : Promise<Investment> {
    const validationErrorEntries = await this.validateCreateInvestmentData(investment);

    if(validationErrorEntries.length !== 0) {
      throw new ValidationError("Failed to create Investment due to invalid data!", 
                                "InvalidCreateInvestmentData",
                                validationErrorEntries);
    }
    
    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const createdInvestment = investmentsRepository.create(investment);
    await investmentsRepository.save(createdInvestment);

    return createdInvestment;
  }

  private static validateInvestmentData(investment : Partial<Investment>) : Array<ValidationErrorEntry> {
    const validationErrorEntries : Array<ValidationErrorEntry> = [];
    
    for(const key in investment) {
      if(investment[key as keyof CreateInvestmentData] === undefined) {
        validationErrorEntries.push({
          message: `"${key}" is a mandatory field!`,
          code: `InvestmentMissing${capitalize(key)}Field`
        });
      }
    }

    if(investment.identifier!.trim() === "") {
      validationErrorEntries.push({
        message: `"identifier" must not be an empty string!`,
        code: "EmptyInvestmentIdentifier"
      });
    }

    if(investment.type !== "VARIABLE" &&
       investment.type !== "FIXED") {
      validationErrorEntries.push({
        message: `"type" must be either "VARIABLE" or "FIXED", but "${investment.type} was found!"`,
        code: "InvalidInvestmentType"
      });
    }

    if(investment.value! < 0) {
      validationErrorEntries.push({
        message: `"value" must be a positive number, but "${investment.value}" was found!`,
        code: "NegativeInvestmentValue"
      });
    }

    return validationErrorEntries;
  }

  private static async validateCreateInvestmentData(investment : CreateInvestmentData) : Promise<Array<ValidationErrorEntry>> {
    const validationErrorEntries : Array<ValidationErrorEntry> = [];
    validationErrorEntries.push(...this.validateInvestmentData(investment));

    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const duplicateInvestments = await investmentsRepository.find({
      ...investment
    });
    const investmentAlreadyExists = duplicateInvestments.length !== 0;

    if(investmentAlreadyExists) {
      validationErrorEntries.push({
        message: "This exact investment already exists!",
        code: "InvestmentAlreadyExists"
      });
    }

    return validationErrorEntries;
  }

  private static validateUpdateInvestmentData(investment : UpdateInvestmentData) : Array<ValidationErrorEntry> {
    const validationErrorEntries : Array<ValidationErrorEntry> = [];
    validationErrorEntries.push(...this.validateInvestmentData(investment));

    return validationErrorEntries;
  }

  public static async getInvestments(query ?: GetInvestmentsQuery) : Promise<PaginatedEntity<Investment>> {

    const transformedQuery = defaults(query ?? {}, {
      identifier: "",
      types: ["VARIABLE", "FIXED"],
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      page: 1,
      perPage: 15
    });
    console.log(transformedQuery?.types);

    const {
      identifier,
      types,
      startDate,
      endDate,
      page,
      perPage
    } = transformedQuery;
    
    const validationErrorEntries = this.validateGetInvestmentsQuery(transformedQuery);
    if(validationErrorEntries.length !== 0) {
      throw new ValidationError("Invalid query!",
                                "InvalidGetInvestmentsQuery",
                                validationErrorEntries);
    }

    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const [fetchedInvestments, total] = await investmentsRepository.findAndCount({
      where: {
        identifier: ILike(`%${identifier}%`),
        type: In(types),
        date: Between(startDate, endDate)
      },
      skip: perPage * (page - 1),
      take: perPage
    });

    return {
      data: fetchedInvestments,
      meta: {
        page,
        perPage,
        total,
        lastPage: computeLastPage(total, perPage)
      }
    };
  }

  private static validateGetInvestmentsQuery(query : Required<GetInvestmentsQuery>) : Array<ValidationErrorEntry> {
    const {
      page,
      perPage
    } = query;

    const validationErrorEntries : Array<ValidationErrorEntry> = [];

    if(page < 1) {
      validationErrorEntries.push({
        message: `"page" is expected to be a positive number, but "${page}" was found!`,
        code: "NonPositivePage"
      });
    }

    if(perPage < 1) {
      validationErrorEntries.push({
        message: `"perPage" is expected to be a positive number, but "${perPage}" was found!`,
        code: "NonPositivePerPage"
      });
    }

    if(perPage > 50) {
      validationErrorEntries.push({
        message: `"perPage" cannot be greater than 50, but "${perPage}" was found!`,
        code: "PerPageTooHigh"
      });
    }

    return validationErrorEntries;
  }

  public static async getInvestmentById(id : string) : Promise<Investment> {
    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const fetchedInvestment = await investmentsRepository.findById(id);

    return fetchedInvestment;
  }

  public static async deleteInvestment(id : string) : Promise<Investment> {
    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const investmentToBeDeleted = await investmentsRepository.findById(id);
    await investmentsRepository.delete(id);

    return investmentToBeDeleted;
  }

  public static async updateInvestment(id : string, investment : Omit<Investment, "id">) : Promise<Investment> {
    const validationErrorEntries = this.validateUpdateInvestmentData(investment);

    if(validationErrorEntries.length !== 0) {
      throw new ValidationError("Failed to create Investment due to invalid data!", 
                                "InvalidCreateInvestmentData",
                                validationErrorEntries);
    }
    
    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const investmentToBeUpdated = await investmentsRepository.findById(id);
    const updatedInvestment = merge(investmentToBeUpdated, investment);
    await investmentsRepository.save(updatedInvestment);

    return updatedInvestment;
  }
}