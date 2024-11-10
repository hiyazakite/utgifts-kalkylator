/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { Title, Table, Box, Tabs, Button, TabsValue, LoadingOverlay } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useState, useEffect, Fragment } from 'react';
import { Expenses } from './Expenses';

export function List({
    persons,
    removePerson,
    activePerson,
    setPendingPersonId,
    updateExpense,
    removeExpense,
    date,
    monthName,
    loading,
}: {
    persons: IPerson[];
    removePerson: (id: number) => Promise<void>;
    activePerson: activePerson | null,
    setPendingPersonId: (id: number) => void;
    updateExpense: (person: IPerson, expense: Expense) => void
    removeExpense: (person: IPerson, id: number | null) => void
    date: Date;
    monthName: string;
    loading: boolean;
}) {
    const [hasExpensesInMonth, setHasExpensesInMonth] = useState<boolean>(false);

    const setActivePersonByName = (name: string) => {
    // 1. Find the person by name in the persons list
    const person = persons.find((p) => p.name === name);

    // 2. If the person is found, set the active person by their ID
    if (person) {
        setPendingPersonId(person.id);
    } else {
        console.error(`No person found with name ${name}`);
    }
};

    useEffect(() => {
        // Check if any person has expenses in the current month
        const hasExpenses = persons.some((person) => person.expenses.some((expense) => expense.date.getMonth() === date.getMonth()));

        // Set hasExpensesInMonth
        setHasExpensesInMonth(hasExpenses);
    }, [persons, date]);

    const personTabs = persons.map((person) => (
            <Tabs.Tab key={person.id} value={person.name} icon={<IconUser size="1.5rem" />}>
                {person.name}
            </Tabs.Tab>
        ));

    return (
        <Box mt={20}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <Title order={2}>Utgifter för {monthName}</Title>
            {persons.length > 0 ? (
                <Tabs
                  radius="md"
                  mt={20}
                  orientation="horizontal"
                  variant="outline"
                  onTabChange={setActivePersonByName}
                  value={activePerson?.name as TabsValue}
                >
                    <Tabs.List>
                        {personTabs}
                        <Button variant="filled" color="red" style={{ marginLeft: 'auto' }} onClick={() => activePerson ? removePerson(activePerson.id) : ''}>Ta bort {activePerson?.name}</Button>
                    </Tabs.List>
                    <>
                        {persons.map((person) => (
                                <Tabs.Panel key={person.id} value={person.name}>
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
