import { Title } from '@mantine/core';
import { PieChart } from 'react-minimal-pie-chart';

export function Charts({
    splitCosts,
}: {
    splitCosts: SplitCost[]
}) {
    const data = splitCosts.map((person) => ({
            id: person.name,
            label: person.name,
            value: Math.abs(person.splitCost),
            color: person.color,
        })
    );
    return (
        <>
            <Title order={3}>Diagram</Title>
            <PieChart
              data={data}
              style={{
                height: '300px',
                width: '300px',
                margin: '0 auto',
            }}
              label={({ dataEntry }) => dataEntry.label}
              labelStyle={
                    {
                        fontSize: '5px',
                        fontFamily: 'sans-serif',
                        fill: '#FFFFFF',
                    }
                }
            />
        </>

    );
}
