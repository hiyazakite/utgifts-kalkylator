import { Grid, Title, Select } from '@mantine/core';

export function Calculations({ persons, date }: { persons: Person[], date: Date }) {
    return (
        <Grid>
            <Grid.Col span={4}>
                <Select label="Välj modell"
                    placeholder="Välj modell"
                    data={[
                        { value: '1', label: 'Dela lika delar' },
                        { value: '2', label: 'Dela justerat för inkomst' },
                        { value: '3', label: 'Modell 3' },
                        { value: '4', label: 'Modell 4' },
                    ]}
                    mt={10}

                />
            </Grid.Col>
            <Grid.Col span={4}>
                <Select label="Justera för skillnad i grundinkomst"
                    placeholder="Ja / Nej"
                    data={[
                        { value: '1', label: 'JA' },
                        { value: '2', label: 'NEJ' },
                    ]}
                    mt={10}

                />
            </Grid.Col>
        </Grid>
    )
}