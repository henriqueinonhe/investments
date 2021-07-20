import { InvestmentType } from "../../src/entities/Investment";
import { InvestmentCreationData } from "../../src/services/InvestmentsService";
import { sample, random as randomNumber } from "lodash";
import { env } from "../../src/env";
import RandExp from "randexp";

export function randomInvestmentType() : InvestmentType {
  return sample(["VARIABLE", "FIXED"])!;
}

export function randomMonthString() : string {
  return new RandExp(/(0[1-9])|10|11|12/).gen();
}

export function randomDayString() : string {
  return new RandExp(/(0[1-9])|((1|2)[0-9])|/).gen();
}

export function randomIdentifier() : string {
  return new RandExp(/\w{3,14}/).gen();
}

export function randomString() : string {
  return new RandExp(/\w{1,20}/).gen();
}

export function randomDate() : string {
  return `${randomNumber(2000, 2020)}-${randomMonthString()}-${randomDayString()}`;
}

export function randomInvestmentCreationData() : InvestmentCreationData {
  return {
    type: randomInvestmentType(),
    user: env.MOCKED_USER!,
    value: randomNumber(0, 100000, true),
    date: `2021-${randomMonthString()}-${randomDayString()}`,
    identifier: randomIdentifier()
  };
}

export function randomList<T>(generator : () => T, length : number) : Array<T> {
  return new Array(length).fill(null).map(() => generator());
}