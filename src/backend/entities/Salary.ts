import { EntitySchema } from 'typeorm';
import type { Person } from './Person';

export interface Salary {
  id: string;
  date: Date;
  amount: number;
  person: Person;
}

export const SalarySchema = new EntitySchema<Salary>({
  name: 'Salary',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    date: {
      type: 'date',
    },
    amount: {
      type: 'decimal',
    },
  },
  relations: {
    person: {
      type: 'many-to-one',
      target: 'Person', // Target is a string name, not a type
      joinColumn: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      inverseSide: 'salaries', // Matches the "salaries" relation in PersonSchema
    },
  },
});
