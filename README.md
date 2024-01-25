# Utgiftskalkylator

Base : React + Mantine, with Vite. (forked vite-mantine official template)

Detta är en applikation som ska underlätta uppdelningen av kostnader under
föräldraledighet.


#Modeller

## Splitting Household Costs Formula

When determining the split of household costs between two parents, where one is on parental leave, you can use the following mathematical formula:

\[ C_i = \frac{I_i}{I_1 + I_{\text{leave}}} \times C \]

Where:
- \(C_i\) is the contribution of the ith person.
- \(I_i\) is the income of the ith person.
- \(I_1\) is the income of the first parent.
- \(I_{\text{leave}}\) is the reduced income during parental leave.
- \(C\) is the total household costs.


# TODO

1. Finslipa formeln och eventuell lägg till olika formler för uppdelning av kostnader
2. Lägg till ta bort och ändra i utgifter och personer.
3. Databas (persistence)
4. Rensa upp så inte personer syns i kalkylen om inga utgifter har lagts till.