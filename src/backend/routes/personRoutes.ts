// routes/personRoutes.ts
import { FastifyInstance } from 'fastify';
import { Between } from 'typeorm';
import { AppDataSource } from '../config/data-source'; // Import the DataSource instance
import { PersonSchema } from '../entities/Person';
import { HouseholdSchema } from '../entities/Household';
import { SalarySchema } from '../entities/Salary';

export async function personRoutes(fastify: FastifyInstance) {
  // Get repositories
  const personRepository = AppDataSource.getRepository(PersonSchema);
  const householdRepository = AppDataSource.getRepository(HouseholdSchema);
  const salaryRepository = AppDataSource.getRepository(SalarySchema);

  fastify.get('/persons', async (request, reply) => {
    const persons = await personRepository.find({ relations: ['household', 'expenses', 'salaries'] });
    reply.send(persons);
  });

  fastify.post('/persons', async (request, reply) => {
    const { id, name, householdId, baseSalary, salaries } = request.body as {
      id?: number;
      name: string;
      householdId: number;
      baseSalary: number;
      salaries: { date: Date; amount: number }[];
    };

    // Check if the household exists
    const household = await householdRepository.findOneBy({ id: householdId });
    if (!household) {
      return reply.status(404).send({ message: 'Household not found' });
    }

    // Find existing person or create a new one
    let person = id ? await personRepository.findOne({ where: { id }, relations: ['salaries', 'household'] }) : null;
    if (person) {
      // Update existing person properties if they are different
      if (person.name !== name) person.name = name;
      if (person.household.id !== householdId) person.household = household;
      if (person.baseSalary !== baseSalary) person.baseSalary = baseSalary;
    } else {
      // Create new person if none found
      person = personRepository.create({
        name,
        household,
        baseSalary,
        salaries: [], // Initialize as an empty array
      });
      await personRepository.save(person);
    }

    // Ensure `person.salaries` is initialized as an array
    person.salaries = person.salaries || [];

    // Use Promise.all with map to avoid duplicates and create/update salaries
    const salaryEntities = await Promise.all(
      salaries.map(async (s) => {
        const salaryDate = new Date(s.date);
        const startOfMonth = new Date(salaryDate.getFullYear(), salaryDate.getMonth(), 1);
        const endOfMonth = new Date(salaryDate.getFullYear(), salaryDate.getMonth() + 1, 0);

        // Check if the salary already exists for this month and year
        const existingSalary = await salaryRepository.findOne({
          where: {
            person: { id: person.id },
            date: Between(startOfMonth, endOfMonth),
          },
        });

        if (existingSalary) {
          existingSalary.amount = s.amount;
          existingSalary.date = s.date;
          await salaryRepository.save(existingSalary);
          return existingSalary;
        }

        const newSalary = salaryRepository.create({
          amount: s.amount,
          date: s.date,
          person,
        });
        await salaryRepository.save(newSalary);
        return newSalary;
      })
    );

    // Update person's salaries without duplicating
    // eslint-disable-next-line max-len
    person.salaries = [...person.salaries, ...salaryEntities.filter((salary) => !person.salaries.includes(salary))];
    await personRepository.save(person);

    return reply.send(person);
  });

  // Delete a person
  fastify.delete('/person/:id', async (request, reply) => {
    const { id } = request.params as { id: number };

    // Check if the person exists
    const person = await personRepository.findOneBy({ id });
    if (!person) {
      return reply.status(404).send({ message: 'Person not found' });
    }

    // Delete the person
    await personRepository.remove(person);
    return reply.send(person);
  });
}
