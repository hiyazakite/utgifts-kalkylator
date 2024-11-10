import axios from 'axios';
/* eslint-disable max-len */
export class Person {
    id: number;
    householdId: number;
    name: string;
    expenses: Expense[];
    baseSalary: number;
    salaries: Salary[];
    extraMonthlyIncome: {
        name: string;
        amount: number;
        date: Date;
    }[];
    // eslint-disable-next-line max-len
    constructor(id: number, householdId: number, name: string, baseSalary: number, currentSalary?: number, expenses: Expense[] = []) {
        this.id = id;
        this.householdId = householdId;
        this.name = name;
        this.baseSalary = baseSalary;
        this.salaries = [
            {
                amount: currentSalary || baseSalary || 0,
                date: new Date(),
            },
        ];
        this.extraMonthlyIncome = [];
        this.expenses = expenses;
    }

    static fromJSON(json: {
    id: number;
    household: Household;
    name: string;
    baseSalary: number;
    currentSalary: number;
    salaries?: Salary[];
    expenses?: Expense[] | undefined;
}): IPerson {
    const newPerson = new Person(json.id, json.household.id, json.name, json.baseSalary, json.currentSalary);
    if (json.salaries && json.salaries.length > 0) {
        // eslint-disable-next-line max-len
        console.log(json.salaries);
        json.salaries.forEach((salary) => {
            const dateObj = new Date(salary.date);
            console.log('DATE OBJECT SALARY: ', dateObj);
            newPerson.upsertSalary(salary.amount, dateObj);
    });
    }
    if (json.expenses && json.expenses.length > 0) {
        json.expenses.forEach((expense) => newPerson.addExpense(expense, false));
    }
    console.log(newPerson);
    return newPerson;
}

    static create = async (person : {
        id?: number;
        household: Household;
        name: string;
        baseSalary: number;
        monthlySalary: number;
        salaryDate: Date;
    }): Promise<IPerson | null> => {
        const { id, household, name, baseSalary, monthlySalary, salaryDate } = person;

        const payload = {
            id,
            householdId: household.id,
            name,
            baseSalary,
            salaries: [{ amount: monthlySalary, date: salaryDate.toJSON() }],
        };
        try {
            const response = await axios.post('/api/persons', payload);
            return Person.fromJSON(response.data);
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    static delete = async (id: number, persons: IPerson[]): Promise<IPerson[]> => {
        try {
            const response = await axios.delete(`/api/person/${id}`);
            if (response.status !== 200) {
                console.log('Error deleting person');
                return persons; // Return unmodified array if deletion was unsuccessful
            }
            // Return the updated persons list if deletion was successful
            return persons.filter((p) => p.id !== id);
        } catch (error) {
            console.log('Error deleting person:', error);
            return persons; // Return unmodified array in case of an error
        }
    };

    save = async () => {
        if (!this.id) throw new Error('Person must have an ID to be saved');
        try {
            await axios.post('/api/persons',
            {
                id: this.id,
                householdId: this.householdId,
                name: this.name,
                baseSalary: this.baseSalary,
                salaries: this.salaries,
            }
            );
        } catch (err) {
            console.log(err);
        }
    };

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
            return this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
        }
            return this.expenses.reduce((acc, expense) => {
                if (
                    expense.date.getMonth() === date.getMonth() &&
                    expense.date.getFullYear() === date.getFullYear()
                ) {
                    return acc + expense.amount;
                }
                return acc;
            }, 0);
    };

    upsertSalary = async (amount: number, date: Date | string): Promise<void> => {
        /**
         * Add a monthly salary to the person's monthly salaries
         * If a salary already exists for the given month, update it
         *
         * @param amount - The amount of the salary
         * @param date - The date of the salary
         * @returns void
         *
         */

        //if date is string, convert to date
        let dateObj;
        if (typeof date === 'string') {
            dateObj = new Date(date);
        } else {
            dateObj = date;
        }

        console.log('Date object in person.upsertSalary: ', dateObj);

        const salary = this.salaries.find((s) => (
                s.date.getMonth() === dateObj.getMonth() &&
                s.date.getFullYear() === dateObj.getFullYear()
            ));

        if (salary) {
            salary.amount = amount; // This is a reference to the object in the array, so it will update the array
        } else {
            this.salaries.push({
                amount,
                date: dateObj,
            });
        }
    };

    addExtraIncome = (name: string, amount: number, date: Date): void => {
        /**
         * Add an extra side income to the person's monthly salaries
         *
         * @param amount - The amount of the income
         * @param date - The date of the income
         * @returns void
         *
         * */
        this.extraMonthlyIncome.push({
            name,
            amount,
            date,
        });
    };

    getCurrentSalary = (date: Date): number => {
        /**
         * Get the monthly salary for a given date
         *
         * @param date - The date to get the salary for
         * @returns The monthly salary
         *
         * */
        const salary = this.salaries.find((s) => (
                s.date.getMonth() === date.getMonth() &&
                s.date.getFullYear() === date.getFullYear()
            ));

        if (salary) {
            return salary.amount;
        }
            return 0;
    };

    addExpense = async (expense: Expense, sync = true): Promise<void> => {
        /**
         * Add an expense to the person's expenses
         *
         * @param expense - The expense to add
         * @param sync - Whether or not to sync the changes to the database
         * @returns void
         *
         */
        // eslint-disable-next-line no-param-reassign
        expense.date = typeof expense.date === 'string' ? new Date(expense.date) : expense.date;
        if (sync) {
            try {
            console.log('Adding expense with date: ', expense.date);
            const payload = {
                description: expense.description,
                amount: expense.amount,
                date: expense.date.toJSON(),
                personId: expense.person,
            };
            console.log(payload, 'EXPENSE PAYLOAD');
            const res = await axios.post('/api/expenses', payload);
            // eslint-disable-next-line no-param-reassign
            expense.id = res.data.id;
            } catch (error) {
                console.log('Error adding expense:', error);
            }
        }
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
        }
            return this.expenses.filter((expense) => (
                    expense.date.getMonth() === date.getMonth() &&
                    expense.date.getFullYear() === date.getFullYear()
                ));
    };

    removeExpense = async (id: number | null): Promise<void> => {
        /**
         * Remove an expense from the person's expenses
         * @param id - The id of the expense to remove
         * @returns void
         *
         */
        if (id === null) return;
        try {
            const response = await axios.delete(`/api/expenses/${id}`);
            if (response.status !== 200) {
                throw new Error(`Failed to delete expense, response: ${response.status}`);
            }
            this.expenses = this.expenses.filter(
                (expense) => expense.id !== id
            );
        } catch (error) {
            console.log(error);
        }
    };

    updateExpense(updatedExpense: Expense): void {
        /**
         * Update an expense in the person's expenses
         * @param updatedExpense - The updated expense
         * @returns void
         *
         */
        this.expenses = this.expenses.map((expense) =>
            expense.id === updatedExpense.id ? updatedExpense : expense
        );
    }

    salaryDiff = (date: Date): number => {
        /**
         * Calculate the percentage difference between the current salary and the base salary
         * @param date - The date to get the salary for
         * @returns The percentage difference between the current salary and the base salary
         */
        const currentSalary = this.getCurrentSalary(date);
        const baseSalary = this.baseSalary || 0;
        return (currentSalary - baseSalary) / baseSalary;
    };
}
