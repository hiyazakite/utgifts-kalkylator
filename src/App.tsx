import { ThemeProvider } from "./ThemeProvider";
import { Form } from "./components/Form";
import { List } from "./components/List";
import { Result } from "./components/Result";
import { Container, Title, Divider } from "@mantine/core";
import { useState } from "react";
import { Person } from "./models/person";
import dayjs from "dayjs";
import "dayjs/locale/sv";

export default function App() {
	const [persons, setPersons] = useState<Person[]>([]);
	const [date, setDate] = useState<Date>(new Date());

	const month = (date: Date, locale: string = "sv") => {
		const monthIndex = dayjs(date).month();
		const monthName = dayjs().locale(locale).month(monthIndex).format("MMMM");
		return monthName;
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
				date: date,
			});
		}
		setPersons([...persons]);
		console.log(persons);
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
			setPersons([...persons, new Person(name, baseSalary, currentSalary)]);
		}
	};

	const removePerson = (name: string): void => {
		const newPersons = persons.filter((person) => person.name !== name);
		setPersons(newPersons);
	};

	return (
		<ThemeProvider>
			<Container size="md" mt={30}>
				<Title order={1}>Utgiftskalkylatorn</Title>
				<Form
					persons={persons}
					handleForm={handleForm}
					upsertPerson={upsertPerson}
					date={date}
					setDate={setDate}
				/>
				<List persons={persons} date={date} monthName={month(date)} />
				<Divider my="lg" />
				<Result persons={persons} date={date} />
			</Container>
		</ThemeProvider>
	);
}
