import { env } from "../env";
import { wrapAsyncController as wrapAsyncController } from "../helpers/wrapController";
import { InvestmentsService } from "../services/InvestmentsService";

const mockedUser = env.MOCKED_USER;

export class InvestmentsController {
  public static getInvestments = wrapAsyncController(async (req, res, next) => {
    const query = {
      ...req.query,
      user: res.locals.authenticatedUser ?? mockedUser
    };
    const fetchedInvestments = await InvestmentsService.getInvestments(query);

    res.status(200).send(fetchedInvestments);
    next();
  });

  public static getInvestmentById = wrapAsyncController(async (req, res, next) => {
    const id = req.params.investmentId!;
    const user = res.locals.authenticatedUser ?? mockedUser;
    const fetchedInvestment = await InvestmentsService.getInvestmentById(id, user);

    res.status(200).send(fetchedInvestment);
    next();
  })

  public static createInvestment = wrapAsyncController(async (req, res, next) => {
    const investment = {
      ...req.body,
      user: res.locals.authenticatedUser ?? mockedUser
    };
    const createdInvestment = await InvestmentsService.createInvestment(investment);
    
    res.status(201).send(createdInvestment);
    next();
  });

  public static deleteInvestment = wrapAsyncController(async (req, res, next) => {
    const id = req.params.investmentId!;
    const user = res.locals.authenticatedUser ?? mockedUser; 
    const deletedInvestment = await InvestmentsService.deleteInvestment(id, user);

    res.status(200).send(deletedInvestment);
    next();
  });

  public static updateInvestment = wrapAsyncController(async (req, res, next) => {
    const id = req.params.investmentId!;
    const newInvestment = {
      ...req.body,
      user: res.locals.authenticatedUser ?? mockedUser
    };
    const updatedInvestment = await InvestmentsService.updateInvestment(id, newInvestment);

    res.status(200).send(updatedInvestment);
    next();
  });
}