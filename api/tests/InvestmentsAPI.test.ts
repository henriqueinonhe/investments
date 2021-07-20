/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearDb, populateInvestments, connect } from "./helpers/db";
import { baseClient } from "./helpers/apiBaseClient";
import { InvestmentCreationData } from "../src/services/InvestmentsService";
import { AxiosResponse } from "axios";
import { randomInvestmentCreationData, randomList, randomString } from "./helpers/random";
import { checkHasValidationErrorEntryCode } from "./helpers/validationErrors";
import { forEach, random as randomNumber } from "lodash";
import { isValidDate } from "../src/helpers/date";
import { InvestmentsRepository } from "../src/repositories/InvestmentsRepository";

afterEach(async () => {
  await clearDb();
});

describe("Create Investment", () => {
  //Populate DB because DB won't be 
  //empty when invesments are created in production
  //therefore it is wise to mimic the production
  //environment as closely as possible
  beforeAll(async () => {
    await populateInvestments();
  });

  const createInvestment = async (investment : InvestmentCreationData) : Promise<AxiosResponse> => {
    return await baseClient.request({
      url: "/investments",
      method: "POST",
      data: investment
    });
  };

  describe("Pre Conditions", () => {
    test("Identifier must be string", async () => {
      const investment = randomInvestmentCreationData();

      const invalidIdentifiers = [() => randomNumber(123123, 0), null, undefined, {}, [], true, false];

      invalidIdentifiers.forEach(async identifier => {
        const response =  await createInvestment({
          ...investment,
          identifier: identifier as any
        });
  
        expect(response.status).toBe(422);
        const error = response.data.error;
        expect(checkHasValidationErrorEntryCode(error, "InvalidInvestmentIdentifier")).toBe(true);
      });
    });

    test("Identifier must not be empty", async () => {
      const investment = randomInvestmentCreationData();
      const response =  await createInvestment({
        ...investment,
        identifier: ""
      });

      expect(response.status).toBe(422);
      const error = response.data.error;
      expect(checkHasValidationErrorEntryCode(error, "InvalidInvestmentIdentifier")).toBe(true);
    });

    test(`Type must be either "FIXED" or "VARIABLE`, async () => {
      const investment = randomInvestmentCreationData();
      const invalidTypes = randomList(randomString, 20)
        .filter(string => string !== "FIXED" && string !== "VARIABLE");
      
      invalidTypes.forEach(async type => {
        const response =  await createInvestment({
          ...investment,
          type: type as any
        });
    
        expect(response.status).toBe(422);
        const error = response.data.error;
        expect(checkHasValidationErrorEntryCode(error, "InvalidInvestmentType")).toBe(true);
      });
    });

    test(`Value must be a positive number`, async () => {
      const investment = randomInvestmentCreationData();
      const invalidValues = [
        ...randomList(() => randomNumber(1, 134325), 10).map(num => num * -1),
        ...randomList(() => randomNumber(1, 134325, true), 10).map(num => num * -1), //Floating point numbers,
        0,
        ...randomList(randomString, 5),
        "",
        true,
        false,
        undefined,
        null,
        {},
        []
      ];

      invalidValues.forEach(async value => {
        const response =  await createInvestment({
          ...investment,
          value: value as any
        });
    
        expect(response.status).toBe(422);
        const error = response.data.error;
        expect(checkHasValidationErrorEntryCode(error, "InvalidInvestmentValue")).toBe(true);
      });
    });

    test(`Date must be a date`, () => {
      const investment = randomInvestmentCreationData();
      const invalidDates = [
        ...randomList(() => randomNumber(-13123, 21323), 10),
        ...randomList(randomString, 10).filter(str => !isValidDate(str)),
        "",
        true,
        false,
        undefined,
        null,
        {},
        [],
        "10-10-2020"
      ];

      invalidDates.forEach(async date => {
        const response = await createInvestment({
          ...investment,
          date: date as any
        });
    
        expect(response.status).toBe(422);
        const error = response.data.error;
        expect(checkHasValidationErrorEntryCode(error, "InvalidInvestmentDate")).toBe(true);
      });
    });
  });

  describe("Post Conditions", () => {
    test("Investments are properly created", async () => {
      const investments = randomList(randomInvestmentCreationData, 100);
      investments.forEach(async investment => {
        const response = await createInvestment(investment);

        expect(response.status).toBe(201);
      });

      const connection =  await connect();
      const investmentsRepository = connection.getCustomRepository(InvestmentsRepository);
      const rawExistingInvestments = await investmentsRepository.find({});
      console.log(rawExistingInvestments.length);
      
    });
  });
});

