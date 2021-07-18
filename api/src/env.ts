import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

export interface EnvironmentVariables {
  PORT : string;
  TYPEORM_CONNECTION : string;
  TYPEORM_HOST : string;
  TYPEORM_USERNAME : string;
  TYPEORM_PASSWORD : string;
  TYPEORM_DATABASE : string;
  TYPEORM_PORT : string;
  TYPEORM_SYNCHRONIZE : string;
  TYPEORM_LOGGING : string;
  MOCKED_USER : string;
  AUTH0_JWKS_URI : string;
  AUTH0_AUDIENCE : string;
  AUTH0_ISSUER : string;
}

const environmentSchema = Joi.object<EnvironmentVariables>({
  PORT: Joi.string()
    .required(),

  TYPEORM_CONNECTION: Joi.string()
    .required(),

  TYPEORM_HOST: Joi.string()
    .required(),

  TYPEORM_USERNAME: Joi.string()
    .required(),

  TYPEORM_PASSWORD: Joi.string()
    .required(),

  TYPEORM_DATABASE: Joi.string()
    .required(),

  TYPEORM_PORT: Joi.string()
    .required(),

  TYPEORM_SYNCHRONIZE: Joi.string()
    .required(),

  TYPEORM_LOGGING: Joi.string()
    .required(),

  MOCKED_USER: Joi.string(),

  AUTH0_JWKS_URI : Joi.string()
    .not().empty()
    .required(),

  AUTH0_AUDIENCE : Joi.string()
    .not().empty()
    .required(),

  AUTH0_ISSUER : Joi.string()
    .not().empty()
    .required()
}).unknown();

const { value, error } = environmentSchema.validate(process.env);

if(error) {
  throw error;
}

export const env : EnvironmentVariables = value;