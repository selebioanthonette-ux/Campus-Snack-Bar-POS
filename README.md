# Campus Snack Bar POS

IT415 Practical Examination — Scenario 4.

A browser-based point of sale project for a campus snack bar. The current
version is **Checkpoint P1: project setup and basic interface**.

## Current interface

- Six official products with prices and visible, disabled Add to Cart buttons.
- Separate Product List, Cart / Order Summary, Payment, and Receipt areas.
- Desktop layout with a stacked layout on smaller screens.

Cart ordering, calculations, payment validation, receipt generation, and New
Transaction are not implemented yet. Payment controls are disabled, and the
receipt area is a placeholder.

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
- Vanilla JavaScript (`script.js`): hard-coded catalog and product rendering.

No installation, build tools, backend, or external dependencies are required.

## How to run

Open `index.html` directly in a modern web browser with JavaScript enabled.
Keep `index.html`, `styles.css`, and `script.js` in the same folder.

## P1 manual checks

1. Confirm all six names and prices match the table above.
2. Confirm every product has a visible disabled Add to Cart button.
3. Confirm all four application areas are clearly labeled and readable.
4. Confirm the empty cart shows ₱0.00 and no receipt is generated.
5. Confirm payment controls are disabled and the page explains that processing
   is planned for a later checkpoint.
6. Resize the browser and check that text remains readable without horizontal
   scrolling.
