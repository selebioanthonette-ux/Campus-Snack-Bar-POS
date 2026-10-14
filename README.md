# Campus Snack Bar POS

IT415 Practical Examination — Scenario 4.

A browser-based point of sale project for a campus snack bar. The current
version is **Checkpoint P2: core ordering, cart, and calculations**.

## Current interface

- Six official products with prices and working Add to Cart buttons.
- Matching local photos for burgers, sandwich, and fries. Nachos and Soda photos are not yet displayed.
- One cart row per product, quantity controls with a minimum of 1, and Remove.
- Automatic subtotals, total, and change preview from the entered cash amount.
- Separate Product List, Cart / Order Summary, Payment, and Receipt areas.
- Desktop layout with a stacked layout on smaller screens.

Payment validation, confirmation, receipt generation, and New Transaction are
not implemented yet. Confirm Payment remains disabled; the receipt is a placeholder.
Change is only a calculation preview and may be negative for insufficient cash.
Blank cash shows a dash. The in-memory cart clears when the page reloads.

## Products

| Product | Price |
| --- | ---: |
| Classic Burger | ₱55.00 |
| Cheeseburger | ₱65.00 |
| Ham Sandwich | ₱40.00 |
| French Fries (Regular) | ₱45.00 |
| Nachos | ₱50.00 |
| Soda (Can) | ₱25.00 |

## Technology and files

- HTML5 (`index.html`): page structure and transaction placeholders.
- CSS (`styles.css`): colors, spacing, and responsive layout.
- Vanilla JavaScript (`script.js`): hard-coded catalog, in-memory cart, rendering, and calculations.
- Local pictures are referenced from `pitures/`; keep this folder in place.

No installation, build tools, backend, or external dependencies are required.

## How to run

Open `index.html` directly in a modern web browser with JavaScript enabled.
Keep `index.html`, `styles.css`, and `script.js` in the same folder.

## P2 manual checks

1. Confirm all six names and prices match the table above.
2. Add one product, then add it again: one row should show quantity 2.
3. Confirm all four application areas are clearly labeled and readable.
4. Confirm the empty cart shows ₱0.00 and no receipt is generated.
5. Increase and decrease quantities. At quantity 1, decrease is disabled; Remove deletes the item.
6. Add Classic Burger × 2, Ham Sandwich × 1, and Soda (Can) × 2.
   Subtotals should be ₱110.00, ₱40.00, and ₱50.00; total should be ₱200.00.
7. Enter 250: change preview should be ₱50.00. Change quantities with cash entered
   and verify that the preview recalculates. Clear cash: preview should show a dash.
8. Confirm Payment stays disabled and no successful receipt appears.
9. Resize the browser and check that text remains readable without horizontal
   scrolling.
