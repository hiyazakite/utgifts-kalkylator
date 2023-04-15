import { Box, Table, Title } from "@mantine/core";
import { summarize } from "../utils/summarize";

export function Result({ persons, date }: { persons: Person[]; date: Date }) {
	const sum = summarize(persons, date);
	return (
		<Box mt={20}>
			<Title order={3}>Kalkyl</Title>
			<Table>
				<thead>
					<tr>
						<th>Namn</th>
						<th>Grundlön</th>
						<th>Aktuell månadslön</th>
						<th>Ändring från grundlön</th>
						<th>Totala utgifter</th>
						<th>Kvarstående</th>
					</tr>
				</thead>
				<tbody>
					{persons.map((person) => {
						return (
							<tr>
								<td>{person.name}</td>
								<td>{person.baseSalary}</td>
								<td>{person.getCurrentSalary(date)}</td>
								<td>{(person.salaryDiff(date) * 100).toFixed(2)}%</td>
								<td>{person.totalCost(date)}</td>
								<td>
									{person.getCurrentSalary(date)
										? person.getCurrentSalary(date) - person.totalCost(date)
										: ""}
								</td>
							</tr>
						);
					})}
				</tbody>
				<tfoot>
					<tr>
						<th>Resultat</th>
						<th>{sum.baseSalary}</th>
						<th>{sum.currentSalary}</th>
						<th>{(sum.salaryDiff() * 100).toFixed(2)}%</th>
						<th>{sum.totalCost}</th>
						<th>{sum.remaining}</th>
					</tr>
				</tfoot>
			</Table>
			{sum.splitCosts().map((person) => {
				return (
					<div>
						{person.name} ska betala {person.splitCost} kronor
					</div>
				);
			})}
		</Box>
	);
}
