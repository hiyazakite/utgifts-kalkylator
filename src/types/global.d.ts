interface Expense {
    id: number | null;
    description: string;
    amount: number;
    date: Date;
    person: number;
}

interface Salary {
    amount: number;
    date: Date;
}
interface ExpenseValues {
    id?: number | null;
    name: string;
    type: string;
    price?: number | ''; // required to clear the search field on state change
}
interface activePerson {
    id: number;
    name: string;
}
interface IPerson {
    id: number;
    name: string;
    expenses: Expense[];
    baseSalary: number;
    salaries: {
        amount: number;
        date: Date;
    }[];
    getCurrentSalary: (date: Date) => number;
    upsertSalary: (currentSalary: number, date: Date) => void
    totalCost: (date?: Date) => number;
    addExpense: (expense: Expense, sync?: boolean) => Promise<void>;
    getExpenses: (date?: Date) => Expense[];
    updateExpense: (expense: Expense) => void;
    removeExpense: (id: number | null) => void;
    salaryDiff: (date: Date) => number;
}

interface PersonValues {
    id: number;
    name: string;
    baseSalary: number; // "" is required to clear the search field on state change
    monthlySalary: number;
}

interface SplitCost {
    name: string;
    id: number;
    splitCost: number;
    totalCost: number;
    color: string;
}

interface Household {
    id: number;
    address?: string;
    persons?: Person[];

}
