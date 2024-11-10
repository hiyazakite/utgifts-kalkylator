import { EntitySchema } from 'typeorm';
import type { Person } from './Person';

export interface Household {
  id: number;
  address: string;
  members: Person[];
}

export const HouseholdSchema = new EntitySchema<Household>({
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
