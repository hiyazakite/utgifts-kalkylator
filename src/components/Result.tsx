import { Box, Table, Title } from "@mantine/core";
import { summarize } from "../utils/summarize";
import { Calculations } from "./Calculations";
import { Charts } from "./Charts"
import { useState } from "react";

export function Result({
    persons,
    date
}: {
    persons: Person[];
    date: Date
}) {

    const sum = summarize(persons, date);
    const [adjustForBaseSalary, setAdjustForBaseSalary] = useState<boolean>(false);


    const splits = sum.splitCosts(adjustForBaseSalary);

    const splitsList = splits.map((person) => {
        return (
            <li key={person.name}>
                {person.name} ska {person.splitCost < person.totalCost ? 'få tillbaka' : 'betala'} {Math.abs(person.splitCost - person.totalCost)} kronor (Utgifts del {person.splitCost} kronor justerat för egna utgifter {person.totalCost} kronor)
            </li>
        )
    })



    if (persons.length > 0) {
        return (
            <Box mt={20}>
                <Title order={3}>Kalkyl</Title>
                <Table mt={10}>
                    <thead>
                        <tr>
                            <th>Namn</th>
                            <th>Grundinkomst</th>
                            <th>Aktuell inkomst</th>
                            <th>Ändring från grundikomst</th>
                            <th>Totala utgifter</th>
                            <th>Kvarstående</th>
                        </tr>
                    </thead>
                    <tbody>
                        {persons.map((person) => {
                            return (
                                <tr key={person.name}>
                                    <td>{person.name}</td>
                                    <td>{person.baseSalary}</td>
                                    <td>{person.getCurrentSalary(date)}</td>
                                    <td>{(person.salaryDiff(date) * 100).toFixed(2)}%</td>
                                    <td>{person.totalCost(date)}</td>
                                    <td>
                                        {person.getCurrentSalary(date)
                                            ? person.getCurrentSalary(date) - person.totalCost(date)
                                            : ""}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Resultat</th>
                            <th>{sum.baseSalary}</th>
                            <th>{sum.currentSalary}</th>
                            <th>{(sum.salaryDiff() * 100).toFixed(2)}%</th>
                            <th>{sum.totalCost}</th>
                            <th>{sum.remaining}</th>
                        </tr>
                    </tfoot>
                </Table>
                <Title order={3} mt={20}>
                    Fördelning av kostnader
                </Title>

                <Calculations {...{ adjustForBaseSalary, setAdjustForBaseSalary }} />
                <ul>
                    {splitsList}
                </ul>

                <Charts splitCosts={splits} />
            </Box>
        );
    }
    else {
        return (
            <Box mt={20}>
                <Title order={3}>Kalkyl</Title>
                <p>Inga personer eller utgifter är tillagda</p>
            </Box>

        )
    }

}
