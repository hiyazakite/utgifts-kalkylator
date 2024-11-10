import { FastifyInstance } from 'fastify';
import { AppDataSource } from '../config/data-source'; // Import your DataSource instance
import { Household, HouseholdSchema } from '../entities/Household'; // Import the interface for typing

export async function householdRoutes(fastify: FastifyInstance) {
  const householdRepository = AppDataSource.getRepository(HouseholdSchema);

  fastify.get('/households', async (request, reply) => {
    const households = await householdRepository.find({ relations: ['members'] });
    reply.send(households);
  });

  fastify.get('/household/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    // Validate if the id is a valid number
    if (!id || Number.isNaN(Number(id))) {
      return reply.code(400).send({ message: 'Invalid ID' });
    }

    try {
      const household = await householdRepository.findOneOrFail({
        where: { id: Number(id) },
        relations: ['members'],
      });
      return await reply.send(household);
    } catch (error) {
      console.log('Error', error);
      return reply.code(404).send({ message: 'Household not found' });
    }
  });

  fastify.post('/household', async (request, reply) => {
    const { address } = request.body as { address: string };
    const household = householdRepository.create({ address } as Partial<Household>);
    await householdRepository.save(household);
    reply.send(household);
  });
}
