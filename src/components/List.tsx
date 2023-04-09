import { Title, Grid, List as MantineList, ThemeIcon } from "@mantine/core";
import {
	IconCircleCheck,
	IconCircleDashed,
	Icon3dCubeSphere,
} from "@tabler/icons-react";

export function List({
	persons,
}: {
	persons: Person[];
}) {
	return (
		<Grid>
			{persons.map((person) => {
				return (
					<Grid.Col span={12 / persons.length}>
						<Title order={3}>{person.name}</Title>
						<Title order={4}>Total kostnad: {person.totalCost()}</Title>
						<MantineList>
							{person.expenses.map((expense) => {
								return (
									<MantineList.Item
										icon={
											<ThemeIcon color="blue" size={24} radius="xl">
												<Icon3dCubeSphere size="1rem" />
											</ThemeIcon>
										}
									>
										{expense.type}: {expense.price}
									</MantineList.Item>
								);
							})}
						</MantineList>
					</Grid.Col>
				);
			})}
		</Grid>
	);
}
