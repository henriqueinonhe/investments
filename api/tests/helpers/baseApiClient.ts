import axios from "axios";

export const baseClient = axios.create({
  baseURL: `https://localhost:${process.env.PORT}`
});