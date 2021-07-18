import { Router } from "express";
import { InvestmentsController } from "./controllers/InvestmentsController";
import { authenticate } from "./middlewares/authenticate";

export const router = Router();

router.use(authenticate);

router.route("/investments")
  .get(InvestmentsController.getInvestments)
  .post(InvestmentsController.createInvestment);

router.route("/investments/:investmentId")
  .get(InvestmentsController.getInvestmentById)
  .put(InvestmentsController.updateInvestment)
  .delete(InvestmentsController.deleteInvestment);
