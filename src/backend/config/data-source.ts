import 'reflect-metadata';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { PersonSchema } from '../entities/Person';
import { HouseholdSchema } from '../entities/Household';
import { ExpenseSchema } from '../entities/Expense';
import { SalarySchema } from '../entities/Salary';

const databasePath = process.env.DATABASE_PATH || 'database.sqlite';

// Initialize TypeORM data source with EntitySchemas
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(databasePath),
  synchronize: true,
  logging: true,
  entities: [PersonSchema, HouseholdSchema, ExpenseSchema, SalarySchema],
});
