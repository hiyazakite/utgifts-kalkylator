"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseSchema = void 0;
const typeorm_1 = require("typeorm");
exports.ExpenseSchema = new typeorm_1.EntitySchema({
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
