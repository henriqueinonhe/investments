import { createConnection as create, Connection, getConnection } from "typeorm";
import { Investment } from "../../src/entities/Investment";
import { env } from "../../src/env";
import { InvestmentsRepository } from "../../src/repositories/InvestmentsRepository";
import { randomInvestmentCreationData, randomList } from "./random";

export async function createConnection() : Promise<void> {
  await create({
    type: "mysql",
    name: "Test Connection",
    host: env.TYPEORM_HOST,
    database: env.TYPEORM_DATABASE,
    username: env.TYPEORM_USERNAME,
    password: env.TYPEORM_PASSWORD,
    port: parseInt(env.TYPEORM_PORT),
    entities: [Investment]
  });
}

export function connection() : Connection {
  return getConnection("Test Connection");
}

export async function clearDb() : Promise<void> {
  await connection().createQueryRunner()
    .clearTable("Investments");
}

export async function populateInvestments() : Promise<Array<Investment>> {

  const investmentsCreationData = randomList(randomInvestmentCreationData, 200);
  const investmentsRepository = connection().getCustomRepository(InvestmentsRepository);
  const investments = investmentsRepository.create(investmentsCreationData);

  await Promise.all(investments.map(investment => investmentsRepository.save(investment)));

  return investments;
}