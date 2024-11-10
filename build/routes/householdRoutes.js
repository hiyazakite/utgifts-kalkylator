"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.householdRoutes = householdRoutes;
const data_source_1 = require("../config/data-source"); // Import your DataSource instance
const Household_1 = require("../entities/Household"); // Import the interface for typing
async function householdRoutes(fastify) {
    const householdRepository = data_source_1.AppDataSource.getRepository(Household_1.HouseholdSchema);
    fastify.get('/households', async (request, reply) => {
        const households = await householdRepository.find({ relations: ['members'] });
        reply.send(households);
    });
    fastify.get('/household/:id', async (request, reply) => {
        const { id } = request.params;
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
        }
        catch (error) {
            console.log('Error', error);
            return reply.code(404).send({ message: 'Household not found' });
        }
    });
    fastify.post('/household', async (request, reply) => {
        const { address } = request.body;
        const household = householdRepository.create({ address });
        await householdRepository.save(household);
        reply.send(household);
    });
}
