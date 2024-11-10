import { UseFormReturnType } from '@mantine/form';

// eslint-disable-next-line max-len
export function resetForms(forms: Array<UseFormReturnType<ExpenseValues> | UseFormReturnType<PersonValues>>) {
    forms.forEach((form) => form.reset());
}
