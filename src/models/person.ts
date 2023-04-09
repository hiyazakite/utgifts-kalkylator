export class Person {
	name: string;
	expenses: Expense[];
	baseSalary?: number;
	currentSalary?: number;
	constructor(name: string, baseSalary?: number, currentSalary?: number) {
		this.name = name;
		this.baseSalary = baseSalary;
		this.currentSalary = currentSalary;
		this.expenses = [];
	}
	totalCost = () => {
		return this.expenses.reduce((acc, expense) => acc + expense.price, 0);
	};

	addExpense = (expense: Expense) => {
		this.expenses.push(expense);
	};

	removeExpense = (expense: Expense) => {
		this.expenses = this.expenses.filter((e) => e !== expense);
	};
}
