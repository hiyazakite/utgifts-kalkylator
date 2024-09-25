import { UseFormReturnType } from '@mantine/form';

export function resetForms(forms: Array<UseFormReturnType<ExpenseValues> | UseFormReturnType<PersonValues>>) {
    forms.forEach((form) => form.reset());
};