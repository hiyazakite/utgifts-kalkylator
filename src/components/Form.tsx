import React, { SyntheticEvent, useEffect } from "react";
import { Grid, Title, TextInput, NumberInput, Button, Select } from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import "dayjs/locale/sv";
import { useForm } from "@mantine/form";


export function Form({
    handleForm,
    persons,
    upsertPerson,
    date,
    setDate,
    activePerson,
    setActivePerson,
}: {
    handleForm: (values: { name: string; price?: number | ""; type: string }) => void;
    persons: Person[];
    upsertPerson: (name: string, baseSalary: number, currentSalary: number) => void;
    date: Date;
    setDate: (date: Date) => void;
    activePerson: string | null;
    setActivePerson: (personName: string | null) => void;
}) {
    const expenseForm = useForm<ExpenseValues>({
        initialValues: {
            name: "",
            price: undefined,
            type: "",
        },
        validate: {
            name: (value) => (!value.trim() ? "Du måste ange ett namn" : undefined),
            type: (value) => (!value.trim() ? "Du måste ange en utgiftstyp" : undefined),
            price: (value) => {
                if (!value) {
                    return "Du måste ange ett pris";
                }
                return value < 0 ? "Priset måste vara positivt" : undefined;
            },
        },
    });

    const personForm = useForm<PersonValues>({
        initialValues: {
            name: "",
        },
        validate: {
            name: (value) => (!value.trim() ? "Du måste ange ett namn" : undefined),
            baseSalary: (value) => (!value || value <= 0 ? "Du måste ange grundlön" : undefined),
            currentSalary: (value) => (!value || value <= 0 ? "Du måste ange nuvarande lön" : undefined),
        },
    });

    useEffect(() => {
        const selectedPerson = persons.find((person) => person.name === personForm.values.name);
        personForm.setFieldValue("baseSalary", selectedPerson?.baseSalary || "");
        personForm.setFieldValue("currentSalary", selectedPerson?.getCurrentSalary(date) || "");
    }, [date]);

    useEffect(() => {
        if (!persons.find((person) => person.name === personForm.values.name)) {
            resetForms();
        }
    }, [persons, personForm.values.name]);

    useEffect(() => {
        handleActivePersonChange();
    }, [activePerson, personForm.values.name]);

    const resetForms = () => {
        personForm.setValues({ name: "", baseSalary: "", currentSalary: "" });
        expenseForm.setValues({ name: "", type: "", price: "" });
    };

    const handleActivePersonChange = () => {
        if (activePerson && activePerson !== personForm.values.name) {
            const person = persons.find((p) => p.name === activePerson);
            if (person) {
                personForm.setValues({
                    name: person.name,
                    baseSalary: person.baseSalary,
                    currentSalary: person.getCurrentSalary(date),
                });
                expenseForm.setValues({
                    name: person.name,
                });
            } else {
                setActivePerson(personForm.values.name);
            }
        }
    };

    const handlePersonFormSubmit = (values: PersonValues) => {
        if (values.baseSalary && values.currentSalary) {
            upsertPerson(values.name, values.baseSalary, values.currentSalary);
        }
    };

    const handleExpenseFormSubmit = (values: ExpenseValues) => {
        handleForm(values);
    };

    return (
        <Grid mt={10}>
            <Grid.Col span={4}>
                <Title order={3}>Välj månad</Title>
                <MonthPicker mt={25} onChange={setDate} value={date} locale="sv" />
            </Grid.Col>
            <Grid.Col span={4} pr={20}>
                <form
                    onSubmit={personForm.onSubmit((values) => {
                        handlePersonFormSubmit(values);
                    })}
                >
                    <Title order={3}>Lägg till/ändra en person</Title>
                    <Select
                        label="Namn"
                        placeholder="Lägg till ny eller välj befintlig"
                        mt={10}
                        {...personForm.getInputProps("name")}
                        data={persons.map((person) => ({
                            label: person.name,
                            value: person.name,
                        }))}
                        creatable
                        getCreateLabel={(name) => `+ Lägg till ${name}`}
                        searchable
                        onCreate={(name) => {
                            upsertPerson(name, 0, 0);
                            personForm.setFieldValue("baseSalary", 0);
                            personForm.setFieldValue("currentSalary", 0);
                            return name;
                        }}
                        onSelect={(evt) => handleSelect(evt)}
                        onChange={(name) => handleSelectChange(name)}
                    />

                    <NumberInput label="Grundlön efter skatt" mt={10} {...personForm.getInputProps("baseSalary")} />
                    <NumberInput
                        label="Aktuell månadslön efter skatt"
                        mt={10}
                        {...personForm.getInputProps("currentSalary")}
                    />
                    <Button type="submit" variant="outline" mt={15}>
                        Lägg till / ändra
                    </Button>
                </form>
            </Grid.Col>
            <Grid.Col span={4} pr={20}>
                <form
                    onSubmit={expenseForm.onSubmit((values) => {
                        handleExpenseFormSubmit(values);
                    })}
                >
                    <Title order={3}>Lägg till en utgift</Title>
                    <Select
                        label="Välj en person"
                        placeholder={persons.length > 0 ? "Välj en person" : "Skapa en person först"}
                        data={persons.map((person) => ({
                            label: person.name,
                            value: person.name,
                        }))}
                        {...expenseForm.getInputProps("name")}
                        mt={10}
                        onSelect={(evt) => handleSelect(evt)}
                        onChange={(name) => handleSelectChange(name)}
                    />
                    <TextInput label="Utgiftstyp" mt={10} {...expenseForm.getInputProps("type")} />
                    <NumberInput label="Pris" mt={10} {...expenseForm.getInputProps("price")} />
                    <Button type="submit" variant="outline" mt={15}>
                        Lägg till
                    </Button>
                </form>
            </Grid.Col>
        </Grid>
    );

    function handleSelect(evt: SyntheticEvent<HTMLInputElement, Event>) {
        const name = evt.currentTarget.value;
        const person = persons.find((person) => person.name === name);
        if (person) {
            setActivePerson(person.name);
            personForm.setFieldValue("baseSalary", person.baseSalary);
            personForm.setFieldValue("currentSalary", person.getCurrentSalary(date));
        }
    }

    function handleSelectChange(name: string | null) {
        const person = persons.find((person) => person.name === name);
        if (person) {
            setActivePerson(name);
        }
    }
}