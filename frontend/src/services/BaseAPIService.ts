import Axios, { AxiosInstance } from "axios";

export class BaseAPIService {
  private static baseClient : AxiosInstance;
  private static isInitialized = false;

  public static async initialize() : Promise<void> {
    if(!this.isInitialized) {
      this.baseClient = Axios.create({
        baseURL: process.env.API_BASE_URL
      });

      this.isInitialized = true;
    }
  }

  public static async getClient() : Promise<AxiosInstance> {
    this.initialize();
    return this.baseClient;
  }
}