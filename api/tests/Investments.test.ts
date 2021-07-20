import { clearDb, populateInvestments } from "./helpers/db";

test("asdasd", async () => {
  await populateInvestments();
  expect(2).toBe(2);
});
