import { Title, Table, Box, Tabs } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

export function List({
	persons,
	date,
	monthName,
}: {
	persons: Person[];
	date: Date;
	monthName: string;
}) {
	//return only persons with expenses in the current month
	const filteredPersons = persons.filter((person) => {
		return person.expenses.some((expense) => {
			return expense.date.getMonth() === date.getMonth();
		});
	});

	if (filteredPersons.length === 0) {
		return (
			<Box mt={20}>
				<Title order={2}>Utgifter för {monthName}</Title>
				<p>Inga utgifter registrerade för denna månad</p>
			</Box>
		);
	} else {
		return (
			<Box mt={20}>
				<Title order={2}>Utgifter för {monthName}</Title>
				<Tabs
					radius="md"
					mt={20}
					orientation="horizontal"
					variant="outline"
					defaultValue={filteredPersons[0].name}
				>
					<Tabs.List>
						{filteredPersons.map((person) => {
							return (
								<Tabs.Tab value={person.name} icon={<IconUser size="1.5rem" />}>
									{person.name}
								</Tabs.Tab>
							);
						})}
					</Tabs.List>
					{filteredPersons.map((person) => {
						return (
							<Tabs.Panel value={person.name} key={person.name}>
								<Box>
									<Table>
										<thead>
											<tr>
												<th>Utgiftstyp</th>
												<th>Kostnad</th>
											</tr>
										</thead>
										<tbody>
											{person.getExpenses(date).map((expense) => {
												return (
													<tr>
														<td>{expense.type}</td>
														<td>{expense.price}</td>
													</tr>
												);
											})}
										</tbody>
										<tfoot>
											<tr>
												<th>Total kostnad</th>
												<th>{person.totalCost(date)}</th>
											</tr>
										</tfoot>
									</Table>
								</Box>
							</Tabs.Panel>
						);
					})}
				</Tabs>
			</Box>
		);
	}
}
