import { EntityRepository, Repository } from "typeorm";
import { Investment } from "../entities/Investment";

@EntityRepository(Investment)
export class InvestmentsRepository extends Repository<Investment> {
}