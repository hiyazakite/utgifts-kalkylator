import { EntitySchema } from 'typeorm';
import type { Household } from './Household';
import type { Expense } from './Expense';
import type { Salary } from './Salary';

export interface Person {
  id: number;
  name: string;
  household: Household;
  expenses: Expense[];
  baseSalary: number;
  salaries: Salary[];
}

export const PersonSchema = new EntitySchema<Person>({
  name: 'Person',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: 'increment',
    },
    name: {
      type: String,
      length: 255,
    },
    baseSalary: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
    },
  },
  relations: {
    household: {
      type: 'many-to-one',
      target: 'Household', // Relation target as a string
      joinColumn: true,
      nullable: false,
      inverseSide: 'members', // Matches the "members" relation in HouseholdSchema
    },
    expenses: {
      type: 'one-to-many',
      target: 'Expense',
      inverseSide: 'person', // Matches the "person" relation in ExpenseSchema
      eager: true, // Eager loading
    },
    salaries: {
      type: 'one-to-many',
      target: 'Salary',
      inverseSide: 'person', // Matches the "person" relation in SalarySchema
      eager: true, // Eager loading
    },
  },
});
