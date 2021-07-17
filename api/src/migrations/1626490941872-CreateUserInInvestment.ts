import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class CreateUserInInvestment1626490941872 implements MigrationInterface {

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.addColumn("Investments", new TableColumn({
      name: "user",
      type: "varchar",
      isNullable: false
    }));
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.dropColumn("Investments", "user");
  }

}
