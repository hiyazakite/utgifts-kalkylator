import { EntitySchema } from 'typeorm';
import type { Person } from './Person';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: Date;
  person: Person;
}

export const ExpenseSchema = new EntitySchema<Expense>({
  name: 'Expense',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: 'increment',
    },
    description: {
      type: String,
      length: 255,
    },
    amount: {
      type: 'decimal',
    },
    date: {
      type: 'date',
    },
  },
  relations: {
    person: {
      type: 'many-to-one',
      target: 'Person',
      joinColumn: true,
      inverseSide: 'expenses',
    },
  },
});
