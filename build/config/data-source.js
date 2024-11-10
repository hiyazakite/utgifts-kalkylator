"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Person_1 = require("../entities/Person");
const Household_1 = require("../entities/Household");
const Expense_1 = require("../entities/Expense");
const Salary_1 = require("../entities/Salary");
// Initialize TypeORM data source with EntitySchemas
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: [Person_1.PersonSchema, Household_1.HouseholdSchema, Expense_1.ExpenseSchema, Salary_1.SalarySchema],
});
