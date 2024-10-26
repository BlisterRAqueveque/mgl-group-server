import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DATABASE: string;
  SEED: string;
  PORT: number;
}

const envsSchema = joi
  .object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    //DB_PASS: joi.string().required(),
    DATABASE: joi.string().required(),
    SEED: joi.string().required(),
    PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  DB_HOST: envVars.DB_HOST,
  DB_PORT: envVars.DB_PORT,
  DB_USER: envVars.DB_USER,
  DB_PASS: envVars.DB_PASS,
  DATABASE: envVars.DATABASE,
  SEED: envVars.SEED,
  PORT: envVars.PORT,
};
