export class Person {
	name: string;
	expenses: Expense[];
	baseSalary?: number;
	monthlySalaries: {
		amount: number;
		date: Date;
	}[];
	constructor(name: string, baseSalary?: number, currentSalary?: number) {
		this.name = name;
		this.baseSalary = baseSalary;
		this.monthlySalaries = [
			{
				amount: currentSalary || baseSalary || 0,
				date: new Date(),
			},
		];
		this.expenses = [];
	}

	totalCost = (date?: Date): number => {
		/**
		 * If no date is passed, return the total cost of all expenses
		 * If a date is passed, return the total cost of all expenses that match the month and year
		 *
		 * @param date - The date to filter by
		 * @returns The total cost of all expenses
		 *
		 */

		if (!date) {
			return this.expenses.reduce((acc, expense) => acc + expense.price, 0);
		} else {
			return this.expenses.reduce((acc, expense) => {
				if (
					expense.date.getMonth() === date.getMonth() &&
					expense.date.getFullYear() === date.getFullYear()
				) {
					return acc + expense.price;
				}
				return acc;
			}, 0);
		}
	};

	upsertMonthlySalary = (amount: number, date: Date): void => {
		/**
		 * Add a monthly salary to the person's monthly salaries
		 * If a salary already exists for the given month, update it
		 *
		 * @param amount - The amount of the salary
		 * @param date - The date of the salary
		 * @returns void
		 *
		 */

		const salary = this.monthlySalaries.find((salary) => {
			return (
				salary.date.getMonth() === date.getMonth() &&
				salary.date.getFullYear() === date.getFullYear()
			);
		});

		if (salary) {
			salary.amount = amount; // This is a reference to the object in the array, so it will update the array
		} else {
			this.monthlySalaries.push({
				amount,
				date,
			});
		}
	};

	getCurrentSalary = (date: Date): number => {
		/**
		 * Get the monthly salary for a given date
		 *
		 * @param date - The date to get the salary for
		 * @returns The monthly salary
		 *
		 * */
		const salary = this.monthlySalaries.find((salary) => {
			return (
				salary.date.getMonth() === date.getMonth() &&
				salary.date.getFullYear() === date.getFullYear()
			);
		});

		if (salary) {
			return salary.amount;
		} else {
			return this.baseSalary || 0;
		}
	};

	addExpense = (expense: Expense): void => {
		/**
		 * Add an expense to the person's expenses
		 *
		 * @param expense - The expense to add
		 * @returns void
		 *
		 */
		this.expenses.push(expense);
	};

	getExpenses = (date?: Date): Expense[] => {
		/**
		 * If no date is passed, return all expenses
		 * If a date is passed, return all expenses that match the month and year
		 *
		 * @param date - The date to filter by
		 * @returns An array of expenses
		 *
		 */

		if (!date) {
			return this.expenses;
		} else {
			return this.expenses.filter((expense) => {
				return (
					expense.date.getMonth() === date.getMonth() &&
					expense.date.getFullYear() === date.getFullYear()
				);
			});
		}
	};

	removeExpense = (expense: Expense) => {
		/**
		 * Remove an expense from the person's expenses
		 *
		 * @param expense - The expense to remove
		 * @returns void
		 *
		 */

		this.expenses = this.expenses.filter((e) => e !== expense);
	};
}
