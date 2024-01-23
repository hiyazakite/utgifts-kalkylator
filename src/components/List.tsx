import { Title, Table, Box, Tabs, Button, ActionIcon, Input } from "@mantine/core";
import { IconUser, IconEdit, IconRowRemove } from "@tabler/icons-react";
import { useState, useEffect, Fragment } from 'react';

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
    const [activeEdit, setActiveEdit] = useState<number | null>(null);

    useEffect(() => {
        // Check if any person has expenses in the current month
        const hasExpenses = persons.some((person) => {
            return person.expenses.some((expense) => {
                return expense.date.getMonth() === date.getMonth();
            });
        });

        // Set hasExpensesInMonth
        setHasExpensesInMonth(hasExpenses);
    }, [persons, date]);


    const personTabs = persons.map((person) => {
        return (
            <Tabs.Tab key={person.name} value={person.name} icon={<IconUser size="1.5rem" />}>
                {person.name}
            </Tabs.Tab>
        );
    })

    const expenseRows = (person: Person) => {
        const rows = person.getExpenses(date).length > 0 ? person.getExpenses(date).map((expense) => {
            return (
                <tr style={{ height: "52px" }}>
                    <td style={{ minWidth: '40%' }}>
                        {activeEdit === expense.id ?
                            <Input value={expense.type} onChange={(e) => {
                                const updatedExpense = { ...expense, type: e.target.value };
                                updateExpense(person, updatedExpense);
                            }} style={{ width: 'fit-content' }} />
                            :
                            `${expense.type} (id: ${expense.id})`
                        }
                    </td>
                    <td style={{ minWidth: '40%' }}>
                        {activeEdit === expense.id ?
                            <Input value={expense.price} onChange={(e) => {
                                const updatedExpense = { ...expense, price: Number(e.target.value) };
                                updateExpense(person, updatedExpense);
                            }} style={{ width: 'fit-content' }} />
                            :
                            expense.price
                        }
                    </td>
                    <td style={{ display: "flex", justifyContent: "end", paddingTop: "11px" }}>
                        <ActionIcon mr="0.5rem" onClick={() => setActiveEdit(activeEdit === expense.id ? null : expense.id)}>
                            <IconEdit size="1.125rem" />
                        </ActionIcon>
                        <ActionIcon onClick={() => removeExpense(person, expense.id)}>
                            <IconRowRemove size="1.125rem" color="#e03131" />
                        </ActionIcon>
                    </td>
                </tr>
            );
        }) : <tr style={{ height: "52px" }}><td>Inga utgifter registrerade för {person.name} för denna månad</td><td></td></tr>
        return rows;
    };

    return (
        <Box mt={20}>
            <Title order={2}>Utgifter för {monthName}</Title>
            {hasExpensesInMonth ? (
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
                    <Fragment>
                        {persons.map((person) => {
                            return (
                                <Tabs.Panel key={person.name} value={person.name}>
                                    <Box>
                                        <Table>

                                            <thead>
                                                <tr style={{ height: "52px" }}>
                                                    <th>Utgiftstyp</th>
                                                    <th>Kostnad</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expenseRows(person)}
                                            </tbody>
                                            <tfoot>
                                                <tr style={{ height: "52px" }}>
                                                    <th>Total kostnad</th>
                                                    <th>{person.totalCost(date)}</th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                        </Table>
                                    </Box>
                                </Tabs.Panel>
                            );
                        })}

                    </Fragment>
                </Tabs>
            ) : (
                <p>Inga utgifter registrerade för denna månad</p>
            )
            }
        </Box>
    )
};
