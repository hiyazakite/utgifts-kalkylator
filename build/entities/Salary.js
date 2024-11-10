"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalarySchema = void 0;
const typeorm_1 = require("typeorm");
exports.SalarySchema = new typeorm_1.EntitySchema({
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
