import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'

const app = fastify()

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

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server running'))
