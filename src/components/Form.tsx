import {
	Grid,
	Title,
	TextInput,
	NumberInput,
	Button,
	Select,
} from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import "dayjs/locale/sv";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
export function Form({
	handleForm,
	persons,
	upsertPerson,
	date,
	setDate,
}: {
	handleForm: (values: { name: string; price?: number; type: string }) => void;
	persons: Person[];
	upsertPerson: (
		name: string,
		baseSalary: number,
		currentSalary: number,
	) => void;
	date: Date;
	setDate: (date: Date) => void;
}) {
	useEffect(() => {
		personForm.setFieldValue(
			"baseSalary",
			persons.find((person) => person.name === personForm.values.name)
				?.baseSalary,
		);
		personForm.setFieldValue(
			"currentSalary",
			persons
				.find((person) => person.name === personForm.values.name)
				?.getCurrentSalary(date),
		);
	}, [date]);
	const expenseForm = useForm({
		initialValues: {
			name: "",
			price: undefined,
			type: "",
		},
		validate: {
			name: (value) => {
				if (!value.trim()) {
					return "Du måste ange ett namn";
				}
			},
			type: (value) => {
				if (!value.trim()) {
					return "Du måste ange en utgiftstyp";
				}
			},
			price: (value) => {
				if (!value) {
					return "Du måste ange ett pris";
				}
				if (value < 0) {
					return "Priset måste vara positivt";
				}
			},
		},
	});

	const personForm = useForm<PersonValues>({
		initialValues: {
			name: "",
		},
		validate: {
			name: (value) => {
				if (!value.trim()) {
					return "Du måste ange ett namn";
				}
			},
			baseSalary: (value) => {
				if (!value) {
					return "Du måste ange grundlön";
				}
			},
			currentSalary: (value) => {
				if (!value) {
					return "Du måste ange nuvarande lön";
				}
			},
		},
	});

	return (
		<Grid mt={10}>
			<Grid.Col span={4}>
				<Title order={3}>Välj månad</Title>
				<MonthPicker mt={25} onChange={setDate} value={date} locale="sv" />
			</Grid.Col>
			<Grid.Col span={4} pr={20}>
				<form
					onSubmit={personForm.onSubmit((values) => {
						if (values.baseSalary && values.currentSalary) {
							upsertPerson(
								values.name,
								values.baseSalary,
								values.currentSalary,
							);
						}
					})}
				>
					<Title order={3}>Lägg till/ändra en person</Title>
					<Select
						label="Namn"
						placeholder="Lägg till ny eller välj befintlig"
						mt={10}
						{...personForm.getInputProps("name")}
						data={persons.map((person) => {
							return {
								label: person.name,
								value: person.name,
							};
						})}
						creatable
						getCreateLabel={(name) => `+ Lägg till ${name}`}
						searchable
						onCreate={(name) => {
							upsertPerson(name, 0, 0);
							personForm.setFieldValue("baseSalary", 0);
							personForm.setFieldValue("currentSalary", 0);
							return name;
						}}
						onSelect={(evt) => {
							//Find the person in the persons array
							const name = evt.currentTarget.value;
							const person = persons.find((person) => person.name === name);
							//If the person exists, set the baseSalary and currentSalary to the values of the person
							console.log(person);
							if (person) {
								personForm.setFieldValue("baseSalary", person.baseSalary);
								personForm.setFieldValue(
									"currentSalary",
									person.getCurrentSalary(date),
								);
							}
						}}
					/>

					<NumberInput
						label="Grundlön"
						mt={10}
						{...personForm.getInputProps("baseSalary")}
					/>
					<NumberInput
						label="Aktuell månadslön"
						mt={10}
						{...personForm.getInputProps("currentSalary")}
					/>
					<Button type="submit" variant="outline" mt={15}>
						Lägg till
					</Button>
				</form>
			</Grid.Col>
			<Grid.Col span={4} pr={20}>
				<form
					onSubmit={expenseForm.onSubmit((values) => {
						handleForm(values);
					})}
				>
					<Title order={3}>Lägg till en utgift</Title>
					<Select
						label="Välj en person"
						placeholder={
							persons.length > 0 ? "Välj en person" : "Skapa en person först"
						}
						data={persons.map((person) => {
							return {
								label: person.name,
								value: person.name,
							};
						})}
						{...expenseForm.getInputProps("name")}
						mt={10}
					/>
					<TextInput
						label="Utgiftstyp"
						mt={10}
						{...expenseForm.getInputProps("type")}
					/>
					<NumberInput
						label="Pris"
						mt={10}
						{...expenseForm.getInputProps("price")}
					/>
					<Button type="submit" variant="outline" mt={15}>
						Lägg till
					</Button>
				</form>
			</Grid.Col>
		</Grid>
	);
}
