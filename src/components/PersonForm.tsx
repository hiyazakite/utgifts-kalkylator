/* eslint-disable consistent-return */
import { useForm, UseFormReturnType } from '@mantine/form';
import { Select, NumberInput, Button, Title } from '@mantine/core';
import { useEffect } from 'react';
import { resetForms } from '../utils/resetForms';

export function PersonForm({
    persons,
    activePerson,
    setPendingPersonId,
    date,
    upsertPerson,
    handleActivePersonChange,
}: {
    persons: IPerson[];
    activePerson: activePerson | null;
    setPendingPersonId: (id: number) => void;
    date: Date;
    // eslint-disable-next-line max-len
    upsertPerson: (name: string, baseSalary: number, monthlySalary: number) => Promise<IPerson | null>;
    handleActivePersonChange: (form: UseFormReturnType<PersonValues>) => void;
}) {
    const personForm = useForm<PersonValues>({
        validate: {
            name: (value) => (!value.trim() ? 'Du måste ange ett namn' : undefined),
            baseSalary: (value) => (!value || value <= 0 ? 'Du måste ange grundlön' : undefined),
            monthlySalary: (value) => {
                if (!value) {
                    return 'Du måste ange aktuell inkomst';
                }
                if (value < 0) {
                    return 'Inkomst måste vara positiv';
                }
                if (value > personForm.values.baseSalary) {
                    return 'Aktuell inkomst kan inte vara högre än grundlönen';
                }
            },
        },
    });

    const handlePersonFormSubmit = async (values: PersonValues) => {
        if (values.baseSalary && values.monthlySalary) {
            await upsertPerson(values.name, values.baseSalary, values.monthlySalary);
        }
    };

    const handleSelectChange = (name: string | null, form: UseFormReturnType<PersonValues>) => {
        const person = persons.find((p) => p.name === name);
        if (person) {
            setPendingPersonId(person.id);
            form.setFieldValue('baseSalary', person.baseSalary);
            form.setFieldValue('monthlySalary', person.getCurrentSalary(date));
        }
    };

    useEffect(() => {
        const selectedPerson = persons.find((person) => person.name === personForm.values.name);

        if (selectedPerson) {
            personForm.setFieldValue('baseSalary', selectedPerson.baseSalary);
            personForm.setFieldValue('monthlySalary', selectedPerson.getCurrentSalary(date));
        } else {
            resetForms([personForm]);
        }

        handleActivePersonChange(personForm);
    }, [date, persons, personForm.values.name, activePerson]);

    return (
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
              {...personForm.getInputProps('name')}
              data={persons.map((person) => ({
                    label: person.name,
                    value: person.name,
                }))}
              creatable
              getCreateLabel={(name) => `+ Lägg till ${name}`}
              searchable
              onCreate={(name) => {
                // Immediately return the name to satisfy the type requirement
                (async () => {
                    const newPerson = await upsertPerson(name, 0, 0); // Await upsertPerson asynchronously
                    personForm.setFieldValue('baseSalary', 0);
                    personForm.setFieldValue('monthlySalary', 0);
                    if (newPerson) {
                        setPendingPersonId(newPerson.id); // Use the id once the person is created
                    }
                })();
                return name; // Return name synchronously
              }}
              onSelect={(evt) => handleSelectChange(evt.currentTarget.value, personForm)}
              onChange={(name) => handleSelectChange(name, personForm)}
            />

            <NumberInput label="Grundinkomst efter skatt" mt={10} {...personForm.getInputProps('baseSalary')} />
            <NumberInput
              label="Aktuell inkomst efter skatt"
              mt={10}
              {...personForm.getInputProps('monthlySalary')}
            />
            <Button type="submit" variant="outline" mt={15}>
                Lägg till / ändra
            </Button>
        </form>
    );
}
