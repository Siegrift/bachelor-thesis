import knex from 'knex'
import config from './config'

type Environment = 'development' | 'staging' | 'production'

const environment = (process.env.ENVIRONMENT as Environment) || 'development'
export default knex(config[environment])
