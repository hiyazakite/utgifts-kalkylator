import { Title, Table, Box, Tabs, Button, ActionIcon, } from "@mantine/core";
import { IconUser, IconAdjustments, IconEdit, IconRowRemove } from "@tabler/icons-react";
import { useState, useEffect } from 'react';

export function List({
    persons,
    removePerson,
    activePerson,
    setActivePerson,
    removeExpense,
    date,
    monthName,
}: {
    persons: Person[];
    removePerson: (personName: string) => void;
    activePerson: string | null,
    setActivePerson: (personName: string | null) => void
    removeExpense: (person: Person, id: number) => void
    date: Date;
    monthName: string;
}) {
    //return only persons with expenses in the current month
    const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);


    useEffect(() => {
        // Filter persons with expenses in the current month
        const filtered = persons.filter((person) => {
            return person.expenses.some((expense) => {
                return expense.date.getMonth() === date.getMonth();
            });
        });

        // Set filtered persons and active person (if any)
        setFilteredPersons(filtered);
        if (filtered.length > 0) {
            setActivePerson(filtered[0].name);
        } else {
            setActivePerson(null);
        }
    }, [persons, date]);

    return (


        <Box mt={20}>
            <Title order={2}>Utgifter för {monthName}</Title>
            {filteredPersons.length === 0 ? (
                <p>Inga utgifter registrerade för denna månad</p>
            ) : (
                <Tabs
                    radius="md"
                    mt={20}
                    orientation="horizontal"
                    variant="outline"
                    onTabChange={setActivePerson}
                    value={activePerson}
                >
                    <Tabs.List>
                        {persons.map((person) => {
                            return (
                                <Tabs.Tab key={person.name} value={person.name} icon={<IconUser size="1.5rem" />}>
                                    {person.name}
                                </Tabs.Tab>
                            );
                        })}
                        <Button variant="filled" color="red" style={{ marginLeft: 'auto' }} onClick={() => activePerson ? removePerson(activePerson) : ''}>Ta bort {activePerson}</Button>
                    </Tabs.List>
                    <div>
                        {persons.map((person) => {
                            return (
                                <Tabs.Panel key={person.name} value={person.name}>
                                    <Box>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Utgiftstyp</th>
                                                    <th>Kostnad</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {person.getExpenses(date).length > 0 ? person.getExpenses(date).map((expense) => {
                                                    return (
                                                        <tr>
                                                            <td>{expense.type}</td>
                                                            <td>{expense.price}</td>
                                                            <td style={{ display: "flex", justifyContent: "end" }}>
                                                                <ActionIcon mr="0.5rem">
                                                                    <IconEdit size="1.125rem" />
                                                                </ActionIcon>
                                                                <ActionIcon onClick={() => {
                                                                    removeExpense(person, expense.id)
                                                                }}  >
                                                                    <IconRowRemove size="1.125rem" color="#e03131" />
                                                                </ActionIcon>
                                                            </td>
                                                        </tr>
                                                    );
                                                }) : <tr><td>Inga utgifter registrerade för {person.name} för denna månad</td><td></td></tr>}
                                            </tbody>
                                            <tfoot>
                                                <tr>
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

                    </div>
                </Tabs>
            )
            }
        </Box>
    )
};
