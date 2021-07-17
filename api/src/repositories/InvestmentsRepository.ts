import { EntityRepository, Repository } from "typeorm";
import { Investment } from "../entities/Investment";
import { ResourceNotFoundError } from "../exceptions/ResourceNotFoundError";

@EntityRepository(Investment)
export class InvestmentsRepository extends Repository<Investment> {
  public async findById(id : string) : Promise<Investment> {
    const fecthedInvestment = await this.findOne({
      where: { id }
    });

    if(fecthedInvestment === undefined) {
      throw new ResourceNotFoundError(`There is no Investment associated with the id "${id}"`,
                                      "InvestmentNotFound");
    }
    
    return fecthedInvestment;
  }
}