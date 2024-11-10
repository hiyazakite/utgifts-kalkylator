import { Container, Title, Divider, Button, TextInput, Center, Stack, Select, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { ThemeProvider } from './ThemeProvider';
import { Form } from './components/Form';
import { List } from './components/List';
import { Result } from './components/Result';
import 'dayjs/locale/sv';
import { Person } from './models/person';

export default function App() {
    const [loading, setLoading] = useState(false);
    const [houseHoldList, setHouseHoldList] = useState<Household[]>([]);
    const [persons, setPersons] = useState<IPerson[]>([]);
    const [date, setDate] = useState<Date>(dayjs().date(25).toDate());
    const [activePerson, setActivePerson] = useState<activePerson | null>(null);
    const [pendingPersonId, setPendingPersonId] = useState<number | null>(null); // New state
    const [household, setHousehold] = useState<Household | null>(null); // Start as null (no household set)
    const month = (d: Date, locale: string = 'sv') => {
        const monthIndex = dayjs(d).month();
        const monthName = dayjs().locale(locale).month(monthIndex).format('MMMM');
        return monthName;
    };
    console.log('Initial date:', date);
    function setActivePersonById(personId: number | null) {
        console.log('setActivePersonById called with personId:', personId);
        console.log('Current activePerson:', activePerson);
        if (personId) {
            const person = persons.find((p) => p.id === personId);
            if (person) {
                setActivePerson({
                    id: person.id,
                    name: person.name,
                });
                console.log('Current active person is: ', activePerson);
            } else {
                console.error(`No person found with id ${personId}`);
                console.log(persons);
            }
        } else {
            setActivePerson(null);
        }
    }

    // Function to load the household list from the API
    function loadHouseHoldList() {
        axios.get('api/households')
            .then((res) => {
                // eslint-disable-next-line max-len
                setHouseHoldList(res.data.map((hh : Household) => ({ id: hh.id, address: hh.address })));
                console.log(houseHoldList);
            })
            .catch((err) => {
                console.log('Error loading households', err);
            }); // Do nothing on error
    }

    // Modified upsertPerson function
    const upsertPerson = async (
        name: string,
        baseSalary: number,
        monthlySalary: number,
    ): Promise<IPerson | null> => {
        setLoading(true);
        if (household !== null) {
            const person = persons.find((p) => p.name === name);
            const isUpdate = !!person;
            console.log('Household ID IS: ', household?.id);
            const payload = {
                id: isUpdate ? person.id : undefined,
                name,
                household,
                baseSalary,
                monthlySalary,
                salaryDate: date,
            };
            console.log(payload, 'UPSERT PERSON PAYLOAD');
            try {
                const newPerson = await Person.create(payload);
                if (isUpdate && newPerson) {
                    setPersons((prevPersons) =>
                        prevPersons.map((p) => (p.id === newPerson.id ? newPerson : p))
                    );
                } else if (newPerson) {
                    setPersons((prevPersons) => [...prevPersons, newPerson]);
                    setPendingPersonId(newPerson.id); // Set pending person ID
                }
                setLoading(false);
                return newPerson;
            } catch (error) {
                console.error('Error upserting person:', error);
                setLoading(false);
                return null;
            }
        } else {
            console.log('No household selected');
            setLoading(false);
            return null;
        }
    };
        // Use useEffect to watch persons and set activePerson based on pendingPersonId
    useEffect(() => {
        if (pendingPersonId !== null) {
            setActivePersonById(pendingPersonId); // Set active person after persons update
            setPendingPersonId(null); // Clear pending ID
        }
    }, [persons, pendingPersonId]); // Runs whenever persons or pendingPersonId changes

    const removePerson = async (id: number) => {
        const newPersons = await Person.delete(id, persons);
        setPersons(newPersons);
        setPendingPersonId(newPersons[0]?.id);
    };

    const removeExpense = async (person: IPerson, id: number | null) => {
        if (id === null) return;
        await person.removeExpense(id);
        setPersons((prevPersons) =>
            prevPersons.map((p) => (p.id === person.id ? { ...person } : p))
        );
    };

    const updateExpense = (person: IPerson, expense: Expense) => {
        setPersons((prevPersons) => {
            const updatedPersons = prevPersons.map((p) => {
                if (p.name === person.name) {
                    p.updateExpense(expense);
                }
                return p;
            });
            return updatedPersons;
        });
    };

    // UI for selecting the household if not set
    const HouseholdInput = () => {
        const [visible, { toggle }] = useDisclosure(false);
        const [inputValue, setInputValue] = useState<string>(''); // Local state to hold input value
        const handleSubmit = () => {
            toggle();
            if (inputValue.trim() !== '') {
                // Post request to API
                axios.post('api/household', {
                    address: inputValue,
                }).then((res) => {
                    setHousehold(res.data);
                    setActivePerson(null);
                    toggle();
                });
            }
        };

        return (
            <Center style={{ height: '100vh' }}>
                <LoadingOverlay visible={visible} overlayBlur={2} />
                <Stack align="center" spacing="md">
                    <Title order={2}>Välj ett hushåll</Title>
                    {houseHoldList.length > 0 ? (
                        // Select dropdown for available households
                        <Select
                          label="Välj ett befintligt hushåll"
                          placeholder="Välj hushåll"
                          // eslint-disable-next-line max-len
                          data={houseHoldList.map((householdItem) => ({ value: String(householdItem.id), label: householdItem.address }))}
                          onChange={async (value: any) => {
                            try {
                                // Fetch household from API
                                const res = await axios.get(`api/household/${value}`);

                                // Set household first and wait for it to finish
                                setHousehold(res.data);

                                // Use the updated household value for mapping persons
                                setPersons(res.data.members.map((p: any) => {
                                    // Set household within each person before calling fromJSON
                                    // eslint-disable-next-line no-param-reassign
                                    p.household = {
                                        id: res.data.id,
                                    };
                                    console.log(p);
                                    return Person.fromJSON(p);
                                }));
                                setPendingPersonId(res.data.members[0]?.id);
                            } catch (error) {
                                console.error('Error fetching household:', error);
                            }
                        }}
                        />
                    ) : (
                        <p>Laddar hushåll...</p>
                    )}
                    <TextInput
                      placeholder="Eller skapa ett nytt hushåll"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button onClick={handleSubmit}>Skapa nytt hushåll</Button>
                </Stack>
            </Center>
        );
    };

        // Fetch households when no household is selected
    useEffect(() => {
        if (!household) {
            loadHouseHoldList();
        }
    }, [household]);

    return (
        <ThemeProvider>
            <Container size="md" mt={30}>
                {household ? (
                    <>
                        <Title order={1}>Utgiftskalkylatorn</Title>
                        <Title order={5} mt="xs">Hushållsbudget för {household.address}</Title>
                        <Form
                          {...{
                                persons,
                                setPersons,
                                upsertPerson,
                                date,
                                setDate,
                                activePerson,
                                setPendingPersonId,
                            }}
                        />
                        <List
                          {...{
                                persons,
                                removePerson,
                                activePerson,
                                setPendingPersonId,
                                updateExpense,
                                removeExpense,
                                date,
                                monthName: month(date),
                                loading,
                                setLoading,
                            }}
                        />
                        <Divider my="lg" />
                        <Result {...{ persons, date }} />
                    </>
                ) : (
                    <HouseholdInput />
                )}
            </Container>
        </ThemeProvider>
    );
}
