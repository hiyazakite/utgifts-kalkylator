"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseholdSchema = void 0;
const typeorm_1 = require("typeorm");
exports.HouseholdSchema = new typeorm_1.EntitySchema({
    name: 'Household',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: 'increment',
        },
        address: {
            type: String,
            length: 255,
        },
    },
    relations: {
        members: {
            type: 'one-to-many',
            target: 'Person', // Relation target as a string
            inverseSide: 'household', // Inverse property name in the Person entity
        },
    },
});
