import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

export type InvestmentType = "VARIABLE" | "FIXED";

@Entity("Investments")
export class Investment {
  @PrimaryColumn()
  public id : string;

  @Column()
  public identifier : string;

  @Column()
  public type : InvestmentType;

  @Column()
  public value : number;

  @Column()
  public date : Date;

  @Column()
  public user : string;

  @Column()
  public createdAt : Date;

  @Column()
  public updatedAt : Date;

  constructor() {
    if(!this.id) {
      this.id = uuid();
    }
  }
}