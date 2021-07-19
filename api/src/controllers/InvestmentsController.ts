import { wrapAsyncController as wrapAsyncController } from "../helpers/wrapController";
import { InvestmentsService } from "../services/InvestmentsService";

export class InvestmentsController {
  public static getInvestments = wrapAsyncController(async (req, res, next) => {
    const query = {
      ...req.query,
      user: req.user!.sub!
    };

    const fetchedInvestments = await InvestmentsService.getInvestments(query);

    res.status(200).send(fetchedInvestments);
    next();
  });

  public static getInvestmentById = wrapAsyncController(async (req, res, next) => {
    const id = req.params.investmentId!;
    const user = req.user!.sub!;
    const fetchedInvestment = await InvestmentsService.getInvestmentById(id, user);

    res.status(200).send(fetchedInvestment);
    next();
  })

  public static createInvestment = wrapAsyncController(async (req, res, next) => {
    const investment = {
      ...req.body,
      user: req.user!.sub!
    };
    const createdInvestment = await InvestmentsService.createInvestment(investment);
    
    res.status(201).send(createdInvestment);
    next();
  });

  public static deleteInvestment = wrapAsyncController(async (req, res, next) => {
    const id = req.params.investmentId!;
    const user = req.user!.sub!; 
    const deletedInvestment = await InvestmentsService.deleteInvestment(id, user);

    res.status(200).send(deletedInvestment);
    next();
  });

  public static updateInvestment = wrapAsyncController(async (req, res, next) => {
    const id = req.params.investmentId!;
    const user = req.user!.sub!;
    const newInvestment = req.body;
    const updatedInvestment = await InvestmentsService.updateInvestment(id, user, newInvestment);

    res.status(200).send(updatedInvestment);
    next();
  });

  public static getInvestmentsSummary = wrapAsyncController(async (req, res, next) => {
    const user = req.user!.sub!;
    const investmentsSummary = await InvestmentsService.getInvestmentsSummary(user);

    res.status(200).send(investmentsSummary);
    next();
  });
}