import { Grid, Title } from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import "dayjs/locale/sv";
import { UseFormReturnType } from "@mantine/form";
import { PersonForm } from "./PersonForm";
import { ExpenseForm } from "./ExpenseForm";

export function Form({
    persons,
    setPersons,
    upsertPerson,
    date,
    setDate,
    activePerson,
    setActivePerson
}: {
    persons: Person[];
    setPersons: (persons: Person[]) => void;
    upsertPerson: (name: string, baseSalary: number, currentSalary: number) => void;
    date: Date;
    setDate: (date: Date) => void;
    activePerson: string | null;
    setActivePerson: (personName: string | null) => void;
}) {



    const handleActivePersonChange = (form: UseFormReturnType<ExpenseValues> | UseFormReturnType<PersonValues>) => {
        if (activePerson && activePerson !== form.values.name) {
            const person = persons.find((p) => p.name === activePerson);
            if (person) {
                form.setValues({
                    name: person.name,
                    baseSalary: person.baseSalary,
                    currentSalary: person.getCurrentSalary(date),
                });
                form.setValues({
                    name: person.name,
                });
            } else {
                setActivePerson(form.values.name);
            }
        }
    };

    return (
        <Grid mt={10}>
            <Grid.Col span={4}>
                <Title order={3}>Välj månad</Title>
                <MonthPicker mt={25} onChange={setDate} value={date} locale="sv" />
            </Grid.Col>
            <Grid.Col span={4} pr={20}>
                <PersonForm {...{ persons, activePerson, setActivePerson, date, upsertPerson, handleActivePersonChange }} />
            </Grid.Col>
            <Grid.Col span={4} pr={20}>
                <ExpenseForm {...{ persons, setPersons, date, activePerson, setActivePerson }} />
            </Grid.Col>
        </Grid>
    );


}