import { clearDb, populateInvestments } from "./helpers/db";

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

  describe("Pre Conditions", () => {
    test("")
  });

  describe("Post Conditions", () => {

  });
});
