import { Input, ActionIcon } from '@mantine/core';
import { IconEdit, IconRowRemove } from '@tabler/icons-react';
import { useState } from 'react';

export function Expenses({
    person,
    date,
    updateExpense,
    removeExpense,
}:
    {
        person: Person;
        date: Date;
        updateExpense: (person: Person, expense: Expense) => void
        removeExpense: (person: Person, id: number) => void
    }
) {
    const [activeEdit, setActiveEdit] = useState<number | null>(null);
    const rows = person.getExpenses(date).length > 0 ? person.getExpenses(date).map((expense) => {
        return (
            <tr key={expense.id} style={{ height: "52px" }}>
                <td style={{ minWidth: '40%' }}>
                    {activeEdit === expense.id ?
                        <Input value={expense.type} onChange={(e) => {
                            const updatedExpense = { ...expense, type: e.target.value };
                            updateExpense(person, updatedExpense);
                        }} style={{ width: 'fit-content' }} />
                        :
                        `${expense.type} (id: ${expense.id})`
                    }
                </td>
                <td style={{ minWidth: '40%' }}>
                    {activeEdit === expense.id ?
                        <Input value={expense.price} onChange={(e) => {
                            const updatedExpense = { ...expense, price: Number(e.target.value) };
                            updateExpense(person, updatedExpense);
                        }} style={{ width: 'fit-content' }} />
                        :
                        expense.price
                    }
                </td>
                <td style={{ display: "flex", justifyContent: "end", paddingTop: "11px" }}>
                    <ActionIcon mr="0.5rem" onClick={() => setActiveEdit(activeEdit === expense.id ? null : expense.id)}>
                        <IconEdit size="1.125rem" />
                    </ActionIcon>
                    <ActionIcon onClick={() => removeExpense(person, expense.id)}>
                        <IconRowRemove size="1.125rem" color="#e03131" />
                    </ActionIcon>
                </td>
            </tr>
        );
    }) : <tr style={{ height: "52px" }}><td>Inga utgifter registrerade för {person.name} för denna månad</td><td></td></tr>
    return rows;
}