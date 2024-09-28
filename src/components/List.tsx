/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { Title, Table, Box, Tabs, Button } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useState, useEffect, Fragment } from 'react';
import { Expenses } from './Expenses';

export function List({
    persons,
    removePerson,
    activePerson,
    setActivePerson,
    updateExpense,
    removeExpense,
    date,
    monthName,
}: {
    persons: Person[];
    removePerson: (personName: string) => void;
    activePerson: string | null,
    setActivePerson: (personName: string | null) => void
    updateExpense: (person: Person, expense: Expense) => void
    removeExpense: (person: Person, id: number) => void
    date: Date;
    monthName: string;
}) {
    const [hasExpensesInMonth, setHasExpensesInMonth] = useState<boolean>(false);

    useEffect(() => {
        // Check if any person has expenses in the current month
        const hasExpenses = persons.some((person) => person.expenses.some((expense) => expense.date.getMonth() === date.getMonth()));

        // Set hasExpensesInMonth
        setHasExpensesInMonth(hasExpenses);
    }, [persons, date]);

    const personTabs = persons.map((person) => (
            <Tabs.Tab key={person.name} value={person.name} icon={<IconUser size="1.5rem" />}>
                {person.name}
            </Tabs.Tab>
        ));

    return (
        <Box mt={20}>
            <Title order={2}>Utgifter för {monthName}</Title>
            {persons.length > 0 ? (
                <Tabs
                  radius="md"
                  mt={20}
                  orientation="horizontal"
                  variant="outline"
                  onTabChange={setActivePerson}
                  value={activePerson}
                >
                    <Tabs.List>
                        {personTabs}
                        <Button variant="filled" color="red" style={{ marginLeft: 'auto' }} onClick={() => activePerson ? removePerson(activePerson) : ''}>Ta bort {activePerson}</Button>
                    </Tabs.List>
                    <>
                        {persons.map((person) => (
                                <Tabs.Panel key={person.name} value={person.name}>
                                    <Box>
                                        <Table>

                                            <thead>
                                                <tr style={{ height: '52px' }}>
                                                    <th>Utgiftstyp</th>
                                                    <th>Kostnad</th>
                                                    <th />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <Expenses {
                                                    ...{
                                                        person,
                                                        date,
                                                        updateExpense,
                                                        removeExpense,
                                                    }
                                                }
                                                />
                                            </tbody>
                                            <tfoot>
                                                <tr style={{ height: '52px' }}>
                                                    <th>Total kostnad</th>
                                                    <th>{person.totalCost(date)}</th>
                                                    <th />
                                                </tr>
                                            </tfoot>
                                        </Table>
                                    </Box>
                                </Tabs.Panel>
                            ))}

                    </>
                </Tabs>
            ) : (
                <p>Inga personer eller utgifter är tillagda</p>
            )
            }
        </Box>
    );
}
