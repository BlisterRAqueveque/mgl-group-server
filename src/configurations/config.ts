//! Inject config module
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { envs } from './envs';
dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: envs.DB_HOST,
  //port: +envs.,
  username: envs.DB_USER,
  password: envs.DB_PASS,
  database: envs.DATABASE,
  autoLoadEntities: true, //! Loads entities
  synchronize: true, //! Synchronize all tables (entities)
};
