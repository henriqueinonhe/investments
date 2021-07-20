import { createConnection, Connection, getCustomRepository } from "typeorm";
import { Investment } from "../../src/entities/Investment";
import { env } from "../../src/env";
import { InvestmentsRepository } from "../../src/repositories/InvestmentsRepository";
import { randomInvestmentCreationData, randomList } from "./random";

export async function connect() : Promise<Connection> {
  return await createConnection({
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

export async function clearDb() : Promise<void> {
  const connection = await connect(); 
  await connection.createQueryRunner()
    .clearTable("Investments");
  await connection.close();
}

export async function populateInvestments() : Promise<Array<Investment>> {
  const connection = await connect();

  const investmentsCreationData = randomList(randomInvestmentCreationData, 200);
  const investmentsRepository = connection.getCustomRepository(InvestmentsRepository);
  const investments = investmentsRepository.create(investmentsCreationData);

  await Promise.all(investments.map(investment => investmentsRepository.save(investment)));

  await connection.close();
  return investments;
}