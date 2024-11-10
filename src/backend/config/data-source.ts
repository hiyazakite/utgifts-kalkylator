import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PersonSchema } from '../entities/Person';
import { HouseholdSchema } from '../entities/Household';
import { ExpenseSchema } from '../entities/Expense';
import { SalarySchema } from '../entities/Salary';

// Initialize TypeORM data source with EntitySchemas
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: true,
  entities: [PersonSchema, HouseholdSchema, ExpenseSchema, SalarySchema],
});
