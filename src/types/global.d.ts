interface Expense {
    id: number,
    type: string;
    price: number;
    date: Date;
}
interface ExpenseValues {
    name: string,
    type: string;
    price?: number | ""; // required to clear the search field on state change
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
    upsertMonthlySalary: (currentSalary: number, date: Date) => void
    totalCost: (date?: Date) => number;
    addExpense: (expense: Expense) => void;
    getExpenses: (date?: Date) => Expense[];
    updateExpense: (expense: Expense) => void;
    removeExpense: (id: number) => void;
    salaryDiff: (date: Date) => number;
}

interface PersonValues {
    name: string;
    baseSalary?: number | ""; // "" is required to clear the search field on state change
    currentSalary?: number | "";
}

interface SplitCost {
    name: string;
    splitCost: number;
    totalCost: number;
}
