import { Investment, InvestmentType } from "../entities/Investment";
import { ValidationError, ValidationErrorEntry } from "../exceptions/ValidationError";
import { InvestmentsRepository } from "../repositories/InvestmentsRepository";
import { capitalize, merge } from "lodash";
import { Between, getCustomRepository, ILike, In } from "typeorm";
import { defaults } from "lodash";
import { computeLastPage, defaultEndDate, defaultStartDate, PaginatedEntity } from "../helpers/utils";
import Joi from "joi";
import { AuthorizationError } from "../exceptions/AuthorizationError";

export interface CreateInvestmentData {
  identifier ?: string;
  user ?: string;
  type ?: InvestmentType;
  value ?: number;
  date ?: string;
}

export interface GetInvestmentsQuery {
  identifier ?: string;
  user : string;
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

  private static validateInvestmentData(investment : CreateInvestmentData) : Array<ValidationErrorEntry> {
    const investmentSchema = Joi.object({
      user: Joi.string()
        .required(),
      
      identifier: Joi.string()
        .not().empty()
        .required(),
      
      type: Joi.string()
        .allow("VARIABLE", "FIXED")
        .required(),

      value: Joi.number()
        .positive()
        .required(),

      date: Joi.date()
        .min(defaultStartDate)
        .max(defaultEndDate)
        .required()

    }).required();

    const { error } = investmentSchema.validate(investment);
      
    if(error) {
      return error.details.map((entry) : ValidationErrorEntry => ({
        code: `InvalidInvestment${capitalize(entry.context!.key)}`,
        message: entry.message
      }));
    }

    return [];
  }

  private static async validateCreateInvestmentData(investment : CreateInvestmentData) : Promise<Array<ValidationErrorEntry>> {
    const validationErrorEntries : Array<ValidationErrorEntry> = [];
    validationErrorEntries.push(...this.validateInvestmentData(investment));

    if(validationErrorEntries.length !== 0) {
      return validationErrorEntries;
    }

    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const duplicateInvestments = await investmentsRepository.find({
      where: investment
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

  public static async getInvestments(query : GetInvestmentsQuery) : Promise<PaginatedEntity<Investment>> {
    const transformedQuery = defaults(query, {
      identifier: "",
      types: ["VARIABLE", "FIXED"],
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      page: 1,
      perPage: 15
    });

    const validationErrorEntries = this.validateGetInvestmentsQuery(transformedQuery);
    if(validationErrorEntries.length !== 0) {
      throw new ValidationError("Invalid query!",
                                "InvalidGetInvestmentsQuery",
                                validationErrorEntries);
    }

    const {
      user,
      identifier,
      types,
      startDate,
      endDate,
      page,
      perPage
    } = transformedQuery;

    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const [fetchedInvestments, total] = await investmentsRepository.findAndCount({
      where: {
        user,
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
    const querySchema = Joi.object({
      user: Joi.string().required(),

      identifier: Joi.string(),

      types: Joi.array()
        .items(Joi.string()),

      startDate: Joi.date(),

      endDate: Joi.date(),

      page: Joi.number()
        .positive(),

      perPage: Joi.number()
        .positive()
        .max(50)
      
    }).required();

    const { error } = querySchema.validate(query);

    if(error) {
      return error.details.map(entry => ({
        message: entry.message,
        code: `InvalidInvestmentQuery${capitalize(entry.context!.key)}`
      }));
    }

    return [];
  }

  private static checkInvestmentUserMatches(investment : Investment, user : string) : void {
    if(investment.user !== user) {
      throw new AuthorizationError("This investment doesn't belong to you!",
                                   "InvestmentUserMismatch");
    }
  }

  public static async getInvestmentById(id : string, user : string) : Promise<Investment> {
    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const fetchedInvestment = await investmentsRepository.findById(id);
    this.checkInvestmentUserMatches(fetchedInvestment, user);

    return fetchedInvestment;
  }

  public static async deleteInvestment(id : string, user : string) : Promise<Investment> {
    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const investmentToBeDeleted = await investmentsRepository.findById(id);
    this.checkInvestmentUserMatches(investmentToBeDeleted, user);

    await investmentsRepository.delete(id);

    return investmentToBeDeleted;
  }

  public static async updateInvestment(id : string, investment : Omit<Investment, "id">) : Promise<Investment> {
    const validationErrorEntries = this.validateUpdateInvestmentData({
      ...investment,
      date: investment.date.toISOString()
    });

    if(validationErrorEntries.length !== 0) {
      throw new ValidationError("Failed to create Investment due to invalid data!", 
                                "InvalidCreateInvestmentData",
                                validationErrorEntries);
    }
    
    const investmentsRepository = getCustomRepository(InvestmentsRepository);
    const investmentToBeUpdated = await investmentsRepository.findById(id);
    this.checkInvestmentUserMatches(investmentToBeUpdated, investment.user);

    const updatedInvestment = merge(investmentToBeUpdated, investment);
    await investmentsRepository.save(updatedInvestment);

    return updatedInvestment;
  }
}