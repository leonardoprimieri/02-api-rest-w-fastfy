import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExistsMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { session_id: sessionId } = request.cookies

  if (!sessionId) {
    return reply.status(401).send({
      message: 'Unauthorized',
    })
  }
}
