import uniqolor from 'uniqolor';

/**
 * Calculates the summary of expenses for a group of persons.
 * @param persons - An array of Person objects.
 * @param date - The date for which the summary is calculated.
 * @returns An object containing various summary properties.
 */

export const summarize = (
    persons: IPerson[],
    date: Date,
): {
    baseSalary: number;
    currentSalary: number;
    salaryDiff: () => number;
    totalCost: number;
    remaining: number;
    splitCosts: (adjustForCurrentSalary: boolean) => Array<SplitCost>;
} => ({
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

        // Calculate the percentage difference between current sum of all salaries and base salaries
        salaryDiff() {
            return (this.currentSalary - this.baseSalary) / this.baseSalary;
        },

        // Calculate the total cost of expenses for all persons
        totalCost: persons.reduce((acc, person) => acc + person.totalCost(date), 0),

        // Calculate the remaining amount after deducting total expenses from current salary
        remaining: persons.reduce((acc, person) => {
            if (person.getCurrentSalary(date)) {
                return acc + person.getCurrentSalary(date) - person.totalCost(date);
            }
            return acc;
        }, 0),

        splitCosts(adjustForCurrentSalary: boolean): SplitCost[] {
            // Map each person to a SplitCost object
            return persons.map(person => {
                // Calculate the person's base salary as a percentage of the total base salary if adjustForBaseSalary is true
                // eslint-disable-next-line max-len
                const currentSalaryPercentage = adjustForCurrentSalary ? person.getCurrentSalary(date) / this.currentSalary : 1 / persons.length;

                // Calculate the split cost as the total cost multiplied by the base salary percentage
                const splitCost = this.totalCost * currentSalaryPercentage;

                return {
                    id: person.id,
                    name: person.name,
                    splitCost: splitCost.toFixed(0) as unknown as number, // Round to 2 decimal places
                    totalCost: person.totalCost(date),
                    color: uniqolor(person.id).color,
                };
            });
        },
    });
