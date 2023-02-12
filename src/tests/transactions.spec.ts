import { afterAll, beforeAll, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { TransactionTypesEnum } from '../enums/transaction-types.enum'

describe('Transactions Service', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 500,
        type: TransactionTypesEnum.CREDIT,
      })
      .expect(201)
  })
})
