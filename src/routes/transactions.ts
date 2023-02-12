import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { TransactionTypesEnum } from '../enums/transaction-types.enum'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select()
    return { transactions }
  })

  app.get('/:id', async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.nativeEnum(TransactionTypesEnum),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )

    const handleAmount = () => {
      return type === TransactionTypesEnum.CREDIT ? amount : amount * -1
    }

    await knex('transactions').insert({
      id: randomUUID(),
      amount: handleAmount(),
      title,
    })

    return reply.status(201).send()
  })
}
