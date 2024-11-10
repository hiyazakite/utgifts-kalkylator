import { FastifyInstance } from 'fastify';
import { AppDataSource } from '../config/data-source'; // Import the DataSource instance
import { ExpenseSchema } from '../entities/Expense';
import { PersonSchema } from '../entities/Person';

export async function expenseRoutes(fastify: FastifyInstance) {
  // Get repositories for Expense and Person
  const expenseRepository = AppDataSource.getRepository(ExpenseSchema);
  const personRepository = AppDataSource.getRepository(PersonSchema);

  // Fetch all expenses with related person
  fastify.get('/expenses', async (request, reply) => {
    const expenses = await expenseRepository.find({ relations: ['person'] });
    reply.send(expenses);
  });

  // Add a new expense
  fastify.post('/expenses', async (request, reply) => {
    const { description, amount, date, personId } = request.body as any;

    // Check if the person exists
    const person = await personRepository.findOneBy({ id: personId });
    if (!person) {
      await reply.status(404).send({ message: 'Person not found' });
      return; // Explicit return to avoid TypeScript errors
    }

    console.log(`ADDING EXPENSE ${description} to ${person.name}`);

    // Create and save a new expense
    const expense = expenseRepository.create({ description, amount, date, person });
    await expenseRepository.save(expense);
    await reply.send(expense);
  });

  // Delete an expense
  fastify.delete('/expenses/:id', async (request, reply) => {
    const { id } = request.params as { id: number };
    console.log(`DELETING EXPENSE ${id}`);

    // Check if the expense exists
    const expense = await expenseRepository.findOneBy({ id });
    if (!expense) {
      return reply.status(404).send({ message: 'Expense not found' });
    }

    // Remove the expense
    await expenseRepository.remove(expense);
    return reply.send({ message: `Expense ${id} deleted` });
  });
}
