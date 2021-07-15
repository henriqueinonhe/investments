import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateInvestments1626314423746 implements MigrationInterface {

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "Investments",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "identifier",
            type: "varchar",
            isNullable: false
          },
          {
            name: "type",
            type: "enum",
            enum: ["VARIABLE", "FIXED"],
            isNullable: false
          },
          {
            name: "value",
            type: "double precision",
            isNullable: false
          },
          {
            name: "date",
            type: "date",
            isNullable: false
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()"
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()"
          }
        ]
      })
    );
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.dropTable("Investments");
  }

}
