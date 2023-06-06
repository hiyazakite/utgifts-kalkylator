interface Expense {
	type: string;
	price: number;
	date: Date;
}

interface Person {
	name: string;
	expenses: Expense[];
	baseSalary?: number;
	monthlySalaries: {
		amount: number;
		date: Date;
	}[];
	getCurrentSalary: (date: Date) => number;
	totalCost: (date?: Date) => number;
	addExpense: (expense: Expense) => void;
	getExpenses: (date?: Date) => Expense[];
	removeExpense: (expense: Expense) => void;
	salaryDiff: (date: Date) => number;
}

interface PersonValues {
	name: string;
	baseSalary?: number;
	currentSalary?: number;
}

interface SplitCost {
	name: string;
	splitCost: number;
}
