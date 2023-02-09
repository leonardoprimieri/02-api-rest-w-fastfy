import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { TransactionTypesEnum } from '../enums/transaction-types.enum'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.nativeEnum(TransactionTypesEnum),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: randomUUID(),
      amount: type === TransactionTypesEnum.CREDIT ? amount : amount * -1,
      title,
    })

    return reply.status(201).send()
  })
}
