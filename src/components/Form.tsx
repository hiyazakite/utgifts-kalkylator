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
export function Form({
	handleForm,
	persons,
	addPerson,
	date,
	setDate,
}: {
	handleForm: (values: { name: string; price?: number; type: string }) => void;
	persons: Person[];
	addPerson: (
		name: string,
		baseSalary?: number,
		currentSalary?: number,
	) => void;
	date: Date;
	setDate: (date: Date) => void;
}) {
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
			},
		},
	});

	const personForm = useForm({
		initialValues: {
			name: "",
			baseSalary: undefined,
			currentSalary: undefined,
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
						addPerson(values.name, values.baseSalary, values.currentSalary);
					})}
				>
					<Title order={3}>Lägg till en person</Title>
					<TextInput
						label="Namn"
						mt={10}
						{...personForm.getInputProps("name")}
					/>
					<NumberInput
						label="Grundlön"
						mt={10}
						{...personForm.getInputProps("baseSalary")}
					/>
					<NumberInput
						label="Nuvarande lön"
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
