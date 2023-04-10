import { Box, Table, Title } from "@mantine/core";

export function Result({ persons, date }: { persons: Person[]; date: Date }) {
	const reducedIncomeRatio = (baseSalary: number, currentSalary: number) => {
		return currentSalary / baseSalary;
	};

	return (
		<Box mt={20}>
			<Title order={3}>Kalkyl</Title>
			<Table>
				<thead>
					<tr>
						<th>Namn</th>
						<th>Grundlön</th>
						<th>Aktuell månadslön</th>
						<th>Andel av grundlön</th>
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
								<td>
									{person.baseSalary && person.getCurrentSalary(date)
										? `${(
												reducedIncomeRatio(
													person.baseSalary,
													person.getCurrentSalary(date),
												) * 100
										  ).toFixed(2)}%`
										: ""}
								</td>
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
						<th>
							{persons.reduce((acc, person) => {
								if (person.baseSalary) {
									return acc + person.baseSalary;
								}
								return acc;
							}, 0)}
						</th>
						<th>
							{persons.reduce((acc, person) => {
								if (person.getCurrentSalary(date)) {
									return acc + person.getCurrentSalary(date);
								}
								return acc;
							}, 0)}
						</th>
						<th>-</th>
						<th>
							{persons.reduce((acc, person) => {
								return acc + person.totalCost(date);
							}, 0)}
						</th>
						<th>
							{persons.reduce((acc, person) => {
								if (person.getCurrentSalary(date)) {
									return (
										acc + person.getCurrentSalary(date) - person.totalCost(date)
									);
								}
								return acc;
							}, 0)}
						</th>
					</tr>
				</tfoot>
			</Table>
		</Box>
	);
}
