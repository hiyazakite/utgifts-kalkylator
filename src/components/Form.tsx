/* eslint-disable max-len */
import { Grid, Title } from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import { UseFormReturnType } from '@mantine/form';
import { Dispatch, SetStateAction } from 'react';
import { PersonForm } from './PersonForm';
import { ExpenseForm } from './ExpenseForm';

export function Form({
    persons,
    setPersons,
    upsertPerson,
    date,
    setDate,
    activePerson,
    setPendingPersonId,
}: {
    persons: IPerson[];
    setPersons: Dispatch<SetStateAction<IPerson[]>>;
    upsertPerson: (name: string, baseSalary: number, monthlySalary: number) => Promise<IPerson | null>;
    date: Date;
    setDate: Dispatch<SetStateAction<Date>>;
    activePerson: activePerson | null;
    setPendingPersonId: (id: number | null) => void;
}) {
    const handleActivePersonChange = (form: UseFormReturnType<ExpenseValues> | UseFormReturnType<PersonValues>) => {
        if (activePerson && activePerson.name !== form.values.name) {
            const person = persons.find((p) => p.name === activePerson.name);
            if (person) {
                form.setValues({
                    name: person.name,
                    baseSalary: person.baseSalary,
                    monthlySalary: person.getCurrentSalary(date),
                });
                form.setValues({
                    name: person.name,
                });
            } else {
                setPendingPersonId(form.values.id ?? null);
            }
        }
    };

    return (
        <Grid mt={10}>
            <Grid.Col md={6} lg={4}>
                <Title order={3}>Välj månad</Title>
                <MonthPicker
                  mt={25}
                  onChange={(selectedDate) => {
                    const adjustedDate = dayjs(selectedDate).date(25).toDate();
                    console.log('Date selected in MonthPicker:', adjustedDate);
                    setDate(adjustedDate);
                  }}
                  value={date}
                  locale="sv"
                />
            </Grid.Col>
            <Grid.Col md={6} lg={4} pr={20}>
                <PersonForm {...{ persons, activePerson, setPendingPersonId, date, upsertPerson, handleActivePersonChange }} />
            </Grid.Col>
            <Grid.Col md={6} lg={4} pr={20}>
                <ExpenseForm {...{ persons, setPersons, date, activePerson, setPendingPersonId }} />
            </Grid.Col>
        </Grid>
    );
}
