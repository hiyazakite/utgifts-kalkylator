/**
 * Calculates the summary of expenses for a group of persons.
 * @param persons - An array of Person objects.
 * @param date - The date for which the summary is calculated.
 * @returns An object containing various summary properties.
 */
export const summarize = (
    persons: Person[],
    date: Date,
): {
    baseSalary: number;
    currentSalary: number;
    salaryDiff: () => number;
    totalCost: number;
    remaining: number;
    splitCosts: () => Array<SplitCost>;
} => {
    return {
        // Calculate the sum of base salaries for all persons
        baseSalary: persons.reduce((acc, person) => {
            if (person.baseSalary) {
                return acc + person.baseSalary;
            }
            return acc;
        }, 0),

        // Calculate the sum of current salaries for all persons
        currentSalary: persons.reduce((acc, person) => {
            if (person.getCurrentSalary(date)) {
                return acc + person.getCurrentSalary(date);
            }
            return acc;
        }, 0),

        // Calculate the percentage difference between current salary and base salary
        salaryDiff() {
            return (this.currentSalary - this.baseSalary) / this.baseSalary;
        },

        // Calculate the total cost of expenses for all persons
        totalCost: persons.reduce((acc, person) => {
            return acc + person.totalCost(date);
        }, 0),

        // Calculate the remaining amount after deducting total expenses from current salary
        remaining: persons.reduce((acc, person) => {
            if (person.getCurrentSalary(date)) {
                return acc + person.getCurrentSalary(date) - person.totalCost(date);
            }
            return acc;
        }, 0),

        // Calculate the split costs for each person based on their salary difference
        splitCosts(): SplitCost[] {
            // Calculate the total reduced salary for all persons
            const totalReducedSalary = persons.reduce((acc, person) => acc + 1 + person.salaryDiff(date), 0);

            // Map each person to a SplitCost object
            return persons.map(person => {
                const reducedSalary = 1 + person.salaryDiff(date);
                return {
                    name: person.name,
                    splitCost: ((reducedSalary / totalReducedSalary) * this.totalCost).toFixed(0) as unknown as number,
                    totalCost: person.totalCost(date)
                };
            });
        }
    };
};
