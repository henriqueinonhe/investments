import { wrapAsyncController as wrapAsyncController } from "../helpers/wrapController";
import { InvestmentsService } from "../services/InvestmentsService";

export class InvestmentsController {
  public static getInvestments = wrapAsyncController(async (req, res, next) => {
    const query = req.query;
    const fetchedInvestments = await InvestmentsService.getInvestments(query);

    res.status(200).send(fetchedInvestments);
    next();
  });

  public static getInvestmentById = wrapAsyncController(async (req, res, next) => {
    const id = req.params.investmentId!;
    const fetchedInvestment = await InvestmentsService.getInvestmentById(id);

    res.status(200).send(fetchedInvestment);
    next();
  })

  public static createInvestment = wrapAsyncController(async (req, res, next) => {
    const investment = req.body;
    const createdInvestment = await InvestmentsService.createInvestment(investment);
    
    res.status(201).send(createdInvestment);
    next();
  });

  public static deleteInvestment = wrapAsyncController(async (req, res, next) => {
    const id = req.params.investmentId!;
    const deletedInvestment = await InvestmentsService.deleteInvestment(id);

    res.status(200).send(deletedInvestment);
    next();
  });
}