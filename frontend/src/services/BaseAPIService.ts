import Axios, { AxiosInstance } from "axios";

export class BaseAPIService {
  private static baseClient : AxiosInstance;
  private static isInitialized : boolean;
  private static token : string | undefined;

  private static checkIsInitialized() : void {
    if(!this.isInitialized) {
      throw Error("LOGIC ERROR! TRYING TO USE UNINITIALIZED API CLIENT!");
    }
  }

  public static isAuthenticated() : boolean {
    return this.token !== undefined;
  }

  public static initialize(token ?: string) : void {
    this.baseClient = Axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    this.isInitialized = true;
  }

  public static async getClient() : Promise<AxiosInstance> {
    this.checkIsInitialized();
    return this.baseClient;
  }
}