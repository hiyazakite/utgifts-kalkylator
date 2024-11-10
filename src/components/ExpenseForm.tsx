import { Button, NumberInput, Select, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useRef } from 'react';
import { resetForms } from '../utils/resetForms';

export function ExpenseForm({
    persons,
    setPersons,
    date,
    activePerson,
    setPendingPersonId,
}: {
    persons: IPerson[];
    setPersons: (persons: IPerson[]) => void;
    date: Date;
    activePerson: activePerson | null;
    setPendingPersonId: (id: number) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const expenseForm = useForm<ExpenseValues>({
        initialValues: {
            id: null,
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

    const clearExpenses = () => {
        expenseForm.setFieldValue('name', activePerson?.name || '');
        expenseForm.setFieldValue('type', '');
        expenseForm.setFieldValue('price', '');
    };

    const handleFormSubmit = async (values: ExpenseValues) => {
        const person = persons.find((p) => p.name === values.name);
        if (person) {
            // Ensure date defaults to the first day of the current month if undefined or current day
            //const firstDayOfMonth = dayjs(date || new Date()).startOf('month').toDate();
            await person.addExpense({
                id: null,
                description: values.type,
                amount: values.price || 0,
                date, // Force first day if date is missing
                person: person.id,
            });
    }
    setPersons([...persons]);
    clearExpenses();
    if (inputRef.current) {
        inputRef.current.focus();
    }
};

    useEffect(() => {
        const person = persons.find((p) => p.name === expenseForm.values.name);
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
              placeholder={persons.length > 0 ? 'Välj en person' : 'Skapa en person först'}
              data={persons.map((person) => ({
                    label: person.name,
                    value: person.name,
                }))}
              {...expenseForm.getInputProps('name')}
              mt={10}
              onChange={(name: string) => {
                    expenseForm.setFieldValue('name', name);
                    const person = persons.find((p) => p.name === name);
                    if (person) {
                        setPendingPersonId(person.id);
                    }
                }}
            />
            <TextInput label="Utgiftstyp" mt={10} {...expenseForm.getInputProps('type')} ref={inputRef} />
            <NumberInput label="Pris" mt={10} {...expenseForm.getInputProps('price')} />
            <Button type="submit" variant="outline" mt={15}>
                Lägg till
            </Button>
        </form>
    );
}
