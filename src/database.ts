import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

export const knexConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: String(process.env.DATABASE_URL),
  },
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    extension: 'ts',
  },
}

export const knex = setupKnex(knexConfig)
