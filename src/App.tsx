import { ThemeProvider } from "./ThemeProvider";
import { Form } from "./components/Form";
import { List } from "./components/List";
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

    const month = (date: Date, locale: string = "sv") => {
        const monthIndex = dayjs(date).month();
        const monthName = dayjs().locale(locale).month(monthIndex).format("MMMM");
        return monthName;
    };

    const handleForm = (values: {
        name: string;
        price?: number | ""; // "" is required to clear the search field on state change
        type: string;
    }) => {
        const person = persons.find((person) => person.name === values.name);
        if (person) {
            person.addExpense({
                id: Date.now(),
                type: values.type,
                price: values.price || 0,
                date: date,
            });
        }
        setPersons([...persons]);
        person ? setActivePerson(person.name) : "";
    };

    const upsertPerson = (
        name: string,
        baseSalary?: number,
        currentSalary?: number,
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
    };

    const removeExpense = (person: Person, id: number) => {
        person.removeExpense(id);

        //React doesn't register changes in nested properties of persons object, hence a manual update is needed
        const updatedPersons = [...persons];
        const personIndex = updatedPersons.findIndex((p) => p.name === person.name);
        updatedPersons[personIndex] = person;
        setPersons(updatedPersons);
    };

    return (
        <ThemeProvider>
            <Container size="md" mt={30}>
                <Title order={1}>Utgiftskalkylatorn</Title>
                <Form
                    {...{
                        persons,
                        handleForm,
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
