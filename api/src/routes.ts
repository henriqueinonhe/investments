import { Router } from "express";
import { InvestmentsController } from "./controllers/InvestmentsController";

export const router = Router();

router.route("/investments")
  .get(InvestmentsController.getInvestments)
  .post(InvestmentsController.createInvestment);

router.route("/investments/:investmentId")
  .get(InvestmentsController.getInvestmentById)
  .put(InvestmentsController.updateInvestment)
  .delete(InvestmentsController.deleteInvestment);
