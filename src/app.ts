import Fastify from 'fastify';
import skinportService from './services/skinport.service';
import db from './db';
import setup from './setup';

const fastify = Fastify({
  logger: true
});

// миграции для простоты... 
setTimeout(() => {
  setup();
}, 10000);


fastify.get('/', async function handler(request, reply) {
  reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send(await skinportService.getMappedItems());
});


fastify.get('/buy', {
}, async function handler(request, reply) {
  const data = await db.query('UPDATE users SET balance = balance - $1 WHERE id = 1 AND balance >= $1 AND balance > 0 RETURNING *', [100]);
  if (data.rowCount === 0) {
    reply.status(400).send({error: 'Not enough balance'});
  } else {
    return data.rows[0];
  }
});



(async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})()