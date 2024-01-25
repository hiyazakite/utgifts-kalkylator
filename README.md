# Utgiftskalkylator

Base : React + Mantine, with Vite. (forked vite-mantine official template)

Detta är en applikation som ska underlätta uppdelningen av kostnader under
föräldraledighet.

## Formler för uppdelning av kostnader

### Justerat för minskad inkomst hos föräldern som är föräldraledig.

Formeln delar upp kostnader justerat för minskad inkomst (i procent) för föräldern som är föräldraledig. Att beakta är att
den med lägst inkomst kommer få kompensera den föräldern med högre inkomst mer. Detta kan valfritt justeras i appen.

$\[ C_i = \frac{I_i}{I_1 + I_{\text{leave}}} \times C \]$

- $\(C_i)$ motsvarar andelen som den förälder med reducerad inkomst ska betala.
- $\(I_i)$ motsvarar grundinkomsten för föräldern med reducerad inkomst.
- $\(I_1)$ motsvarar inkomsten för föräldern som arbetar.
- $\(I_{\text{leave}})$ motsvarar inkomsten för föräldern som är föräldraledig.
- $\(C\)$ motsvara totala hushållskostander.


# TODO

1. Finslipa formeln och eventuell lägg till olika formler för uppdelning av kostnader
2. Lägg till ta bort och ändra i utgifter och personer.
3. Databas (persistence)
4. Rensa upp så inte personer syns i kalkylen om inga utgifter har lagts till.