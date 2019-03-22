import * as Knex from 'knex'
import { config as applyEnv } from 'dotenv'
import { join } from 'path'

// apply .env properties to `process.env`
const configResult = applyEnv({ path: join(__dirname, '../../.env') })
if (configResult.error) throw configResult.error
const { DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

type Config = {
  [env: string]: Knex.Config;
}

const config: Config = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: DB_PORT as any,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      charset: 'utf8',
    },
    migrations: {
      directory: join(__dirname, 'migrations'),
    },
    seeds: {
      directory: join(__dirname, 'seeds'),
    },
    debug: true,
    asyncStackTraces: true,
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}

export default config
