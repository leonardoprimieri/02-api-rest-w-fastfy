import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { TransactionTypesEnum } from '../enums/transaction-types.enum'
import { checkSessionIdExistsMiddleware } from '../middlewares/check-session-id-exists.middleware'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExistsMiddleware],
    },
    async (request) => {
      const { session_id: sessionId } = request.cookies

      const transactions = await knex('transactions')
        .select()
        .where('session_id', sessionId)
      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExistsMiddleware],
    },
    async (request) => {
      const { session_id: sessionId } = request.cookies
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExistsMiddleware],
    },
    async (request) => {
      const { session_id: sessionId } = request.cookies

      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first()

      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.nativeEnum(TransactionTypesEnum),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('session_id', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      })
    }

    const handleAmount = () => {
      return type === TransactionTypesEnum.CREDIT ? amount : amount * -1
    }

    await knex('transactions').insert({
      id: randomUUID(),
      amount: handleAmount(),
      title,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
