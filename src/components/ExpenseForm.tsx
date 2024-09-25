import { Button, NumberInput, Select, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useRef } from "react";
import { resetForms } from "../utils/resetForms";

export function ExpenseForm({
    persons,
    setPersons,
    date,
    activePerson,
    setActivePerson,
}: {
    persons: Person[];
    setPersons: (persons: Person[]) => void;
    date: Date;
    activePerson: string | null;
    setActivePerson: (personName: string | null) => void;
}) {
    const inputRef = useRef(null);

    const clearExpenses = () => {
        expenseForm.setFieldValue('name', activePerson || '');
        expenseForm.setFieldValue('type', '');
        expenseForm.setFieldValue('price', '');
    }

    const expenseForm = useForm<ExpenseValues>({
        initialValues: {
            name: '',
            price: undefined,
            type: '',
        },
        validate: {
            name: (value) => (!value.trim() ? 'Du måste ange ett namn' : undefined),
            type: (value) => (!value.trim() ? 'Du måste ange en utgiftstyp' : undefined),
            price: (value) => {
                if (!value) {
                    return 'Du måste ange ett pris';
                }
                return value < 0 ? 'Priset måste vara positivt' : undefined;
            },
        },
    });

    const handleFormSubmit = (values: ExpenseValues) => {
        const person = persons.find((person) => person.name === values.name);
        if (person) {
            person.addExpense({
                id: Date.now(),
                type: values.type,
                price: values.price || 0,
                date,
            });
        }
        setPersons([...persons]);
        person ? setActivePerson(person.name) : '';
        clearExpenses();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        const person = persons.find((person) => person.name === expenseForm.values.name);
        if (person) {
            clearExpenses();
        } else {
            resetForms([expenseForm]);
        }
    }, [activePerson, expenseForm.values.name]);

    return (
        <form
            onSubmit={expenseForm.onSubmit((values) => {
                handleFormSubmit(values);
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
                onChange={(name: string) => {
                    expenseForm.setFieldValue("name", name);
                    const person = persons.find((person) => person.name === name);
                    if (person) {
                        setActivePerson(person.name);
                    }
                    ;
                }}
            />
            <TextInput label="Utgiftstyp" mt={10} {...expenseForm.getInputProps("type")} ref={inputRef} />
            <NumberInput label="Pris" mt={10} {...expenseForm.getInputProps("price")} />
            <Button type="submit" variant="outline" mt={15}>
                Lägg till
            </Button>
        </form>
    )
}