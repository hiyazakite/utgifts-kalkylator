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
		baseSalary: persons.reduce((acc, person) => {
			if (person.baseSalary) {
				return acc + person.baseSalary;
			}
			return acc;
		}, 0),
		currentSalary: persons.reduce((acc, person) => {
			if (person.getCurrentSalary(date)) {
				return acc + person.getCurrentSalary(date);
			}
			return acc;
		}, 0),
		salaryDiff() {
			return (this.currentSalary - this.baseSalary) / this.baseSalary;
		},
		totalCost: persons.reduce((acc, person) => {
			return acc + person.totalCost(date);
		}, 0),
		remaining: persons.reduce((acc, person) => {
			if (person.getCurrentSalary(date)) {
				return acc + person.getCurrentSalary(date) - person.totalCost(date);
			}
			return acc;
		}, 0),
		splitCosts(): SplitCost[] {
			let splits: SplitCost[] = [];
			persons.reduce((acc, person, index) => {
				const reducedSalary = 1 + person.salaryDiff(date);
				splits.push({
					name: person.name,
					splitCost: reducedSalary,
				});
				if (index === persons.length - 1) {
					const sumSplits = acc + reducedSalary;
					splits = splits.map((person) => {
						return {
							name: person.name,
							splitCost: (
								(person.splitCost / sumSplits) *
								this.totalCost
							).toFixed(0) as unknown as number,
						};
					});
				}
				return acc + reducedSalary;
			}, 0);
			return splits;
		},
	};
};
