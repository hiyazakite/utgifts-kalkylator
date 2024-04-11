import { ThemeProvider } from "./ThemeProvider";
import { Form } from "./components/Form";
import { List } from "./components/List";
import { Calculations } from "./components/Calculations";
import { Result } from "./components/Result";
import { Container, Title, Divider } from "@mantine/core";
import { useState } from "react";
import { Person as PersonClass } from "./models/person";
import dayjs from "dayjs";
import "dayjs/locale/sv";

export default function App() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [activePerson, setActivePerson] = useState<string | null>('');
    const [household, setHousehold] = useState<string>('Franzéngatan 39');

    const month = (date: Date, locale: string = "sv") => {
        const monthIndex = dayjs(date).month();
        const monthName = dayjs().locale(locale).month(monthIndex).format("MMMM");
        return monthName;
    };

    const upsertPerson = (
        name: string,
        baseSalary: number,
        currentSalary: number,
    ): void => {
        //if person exists, update
        const person = persons.find((person) => person.name === name);

        if (person) {
            baseSalary ? (person.baseSalary = baseSalary) : "";
            currentSalary ? person.upsertMonthlySalary(currentSalary, date) : "";
            setPersons([...persons]);
            return;
        } else {
            //if person does not exist, create
            setPersons([...persons, new PersonClass(name, baseSalary, currentSalary)]);
            setActivePerson(name)
        }
    };

    const removePerson = (personName: string): void => {
        const newPersons = persons.filter((person) => person.name !== personName);
        setPersons(newPersons);
        setActivePerson(persons[0]?.name || null)
    };

    const removeExpense = (person: Person, id: number) => {
        setPersons((prevPersons) => {
            const updatedPersons = prevPersons.map((p) => {
                if (p.name === person.name) {
                    p.removeExpense(id);
                }
                return p;
            });
            return updatedPersons;
        });
    };

    const updateExpense = (person: Person, expense: Expense) => {
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

    return (
        <ThemeProvider>
            <Container size="md" mt={30}>
                <Title order={1}>Utgiftskalkylatorn</Title>
                <Title order={5} mt="xs">Hushållsbudget för {household}</Title>
                <Form
                    {...{
                        persons,
                        setPersons,
                        upsertPerson,
                        date,
                        setDate,
                        activePerson,
                        setActivePerson,
                    }}
                />
                <List
                    {...{
                        persons,
                        removePerson,
                        activePerson,
                        setActivePerson,
                        updateExpense,
                        removeExpense,
                        date,
                        monthName: month(date),
                    }}
                />
                <Divider my="lg" />
                <Result {...{ persons, date }} />
            </Container>
        </ThemeProvider>
    );
}
