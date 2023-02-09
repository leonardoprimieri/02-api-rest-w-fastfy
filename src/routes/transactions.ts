import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transaction = await knex('transactions')
      .insert({
        id: randomUUID(),
        title: 'Test transaction',
        amount: 1000,
      })
      .returning('*')
    return transaction
  })
}
