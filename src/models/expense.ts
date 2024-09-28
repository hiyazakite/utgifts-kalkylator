export class Expense {
    id: string;
    name: string;
    price: number;
    date: Date;
    constructor(name: string, price: number, date: Date) {
        this.id = '';
        this.name = name;
        this.price = price;
        this.date = date;
    }
}
