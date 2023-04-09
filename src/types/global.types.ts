type Expense = {
	type: string;
	price: number;
};
type Person = {
	name: string;
	expenses: Expense[];
	totalCost: () => number;
};
