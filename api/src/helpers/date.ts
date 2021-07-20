import Joi from "joi";
import { defaultEndDate, defaultStartDate } from "./utils";

export function isValidDate(date ?: string) : boolean {
  if(date === undefined) {
    return false;
  }
  const { error } = Joi.date()
    .required()
    .min(defaultStartDate)
    .max(defaultEndDate)
    .validate(date);

    
  const hasRightFormat = /^\d{1,4}-\d\d-\d\d$/.test(date);
  
  return error === undefined && hasRightFormat;
}