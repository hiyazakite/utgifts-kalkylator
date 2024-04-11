import { Grid, Checkbox } from '@mantine/core';

export function Calculations({
    adjustForBaseSalary,
    setAdjustForBaseSalary,
}: {
    adjustForBaseSalary: boolean,
    setAdjustForBaseSalary: (adjustForBaseSalary: boolean) => void
}) {
    return (
        <Grid mt={10}>
            <Grid.Col span={4}>
                <Checkbox
                    label="Justera för skillnad i aktuell inkomst"
                    mt={32}
                    checked={adjustForBaseSalary}
                    onChange={(evt) => { setAdjustForBaseSalary(evt.currentTarget.checked) }}
                />
            </Grid.Col>
        </Grid>
    )
}