import { ThemeProvider } from "./ThemeProvider";
import { Form } from "./components/Form";
import { List } from "./components/List";
import { Result } from "./components/Result";
import { Container, Title } from "@mantine/core";
import { useState } from "react";
import { Person } from "./models/person";
import dayjs from "dayjs";
import "dayjs/locale/sv";

export default function App() {
	const [persons, setPersons] = useState<Person[]>([]);
	const [date, setDate] = useState<Date>(new Date());

	const month = () => {
		const monthIndex = dayjs(date).month();
		const swedishMonth = dayjs().locale("sv").month(monthIndex).format("MMMM");
		return swedishMonth;
	};

	const handleForm = (values: {
		name: string;
		price?: number;
		type: string;
	}) => {
		const person = persons.find((person) => person.name === values.name);
		if (person) {
			person.addExpense({
				type: values.type,
				price: values.price || 0,
			});
		}
		setPersons([...persons]);

		console.log(persons);
	};

	const addPerson = (
		name: string,
		baseSalary?: number,
		currentSalary?: number,
	) => {
		setPersons([...persons, new Person(name, baseSalary, currentSalary)]);
	};

	const removePerson = (name: string) => {
		const newPersons = persons.filter((person) => person.name !== name);
		setPersons(newPersons);
	};

	return (
		<ThemeProvider>
			<Container size="md" mt={30}>
				<Title order={1}>Utgiftskalkylatorn ({month()})</Title>
				<Form
					persons={persons}
					handleForm={handleForm}
					addPerson={addPerson}
					date={date}
					setDate={setDate}
				/>
				<List persons={persons} />
				<Result />
			</Container>
		</ThemeProvider>
	);
}
