import { Router } from "express";
import { InvestmentsController } from "./controllers/InvestmentsController";

export const router = Router();

router.route("/users/:userId/investments")
  .get(InvestmentsController.getInvestments)
  .post(InvestmentsController.createInvestment);

router.route("/users/:userId/investments/:investmentId")
  .get(InvestmentsController.getInvestmentById)
  .delete(InvestmentsController.deleteInvestment);
