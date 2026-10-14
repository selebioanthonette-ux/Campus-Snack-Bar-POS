# Campus Snack Bar POS

IT415 Practical Examination — Scenario 4.

A single-page cash point of sale application for a campus snack bar, implemented
with HTML5, CSS, and vanilla JavaScript. P3 completes the required transaction flow.

## Features

- Six official products and prices, with four matching local product photos.
- Add to Cart; repeated adds increase quantity in the existing row.
- Increase, decrease (minimum 1), and Remove controls.
- Automatic item subtotals, total, and change preview.
- Cash validation for empty cart, blank, non-numeric, negative, and insufficient payment.
- Exact and excess payments, success confirmation, and calculated change.
- Digital receipt overlay with items, quantities, subtotals, total, paid amount,
  change, and sequential transaction reference.
- Completed orders are locked until New Transaction clears the transaction.
- Compact desktop layout with catalog, cart, and payment side by side. Receipt
  uses a native dialog and consumes no space in the main layout when closed.

## Official products

| Product | Price |
| --- | ---: |
| Classic Burger | ₱55.00 |
| Cheeseburger | ₱65.00 |
| Ham Sandwich | ₱40.00 |
| French Fries (Regular) | ₱45.00 |
| Nachos | ₱50.00 |
| Soda (Can) | ₱25.00 |

## Technology and files

- `index.html`: application areas, cash input, actions, receipt dialog.
- `styles.css`: readable compact layout, responsive rules, dialog styling.
- `script.js`: hard-coded products, in-memory cart, calculations, payment,
  receipt generation, and reset.
- `pitures/`: four photos currently referenced by the catalog.
- `tests/cart.test.cjs`: optional Node.js checks using a minimal DOM stub.

There are no external dependencies, frameworks, backend, database, or build tools.
Node.js is used only for optional automated testing, not to run the application.

## How to run

Open `index.html` in a modern browser supporting the native HTML dialog element.
Keep the CSS, JavaScript, and `pitures/` folder beside it. Enable JavaScript.
No server or installation is needed.

## Transaction flow

1. Add products and adjust quantities; review subtotals and total.
2. Enter cash using a plain number with up to two decimal places (for example,
   `250` or `250.50`), then select Confirm Payment. Press Tab and Enter/Space to
   operate controls with the keyboard.
3. Invalid payment shows feedback and generates no receipt.
4. Successful payment displays confirmation and opens the receipt overlay.
5. Close the receipt or press Escape to review the completed order. View Receipt
   reopens it. The order and cash input remain locked.
6. Select New Transaction from the main page or receipt to clear the cart,
   quantities, totals, cash, change, messages, and receipt, and unlock ordering.

References begin at `TXN-001` and increase only after successful payment.
New Transaction preserves the reference counter. Reloading the page clears all
in-memory data and restarts the counter; there is no receipt history or persistence.
The change preview may be negative before confirmation; this is not payment approval.

## Verification and manual testing

Optional automated command: `node tests/cart.test.cjs`.
Tests exercise JavaScript with a DOM stub; they do not prove browser layout,
image loading, native dialog focus behavior, or screenshot fit.

Perform these checks in a browser:

1. Verify all six products and prices, and the four matching photos.
2. Add one product, several products, and the same product repeatedly. Repeated
   Add should increase quantity without duplicate rows.
3. Increase/decrease quantities; decrease is disabled at 1. Remove items.
   Check subtotals and total update after every change.
4. Build Classic Burger × 2, Ham Sandwich × 1, Soda (Can) × 2.
   Subtotals: ₱110.00, ₱40.00, ₱50.00. Total: ₱200.00.
5. Attempt payment with an empty cart: reject with a clear message.
6. With the primary order, test blank, `abc`, `-1`, and `199`: reject each and
   generate no receipt. Insufficient feedback should state the ₱200.00 minimum.
7. Enter `200`: accept with ₱0.00 change. Check receipt items, quantities,
   subtotals, total, amount paid, change, and transaction reference.
8. Confirm Add/quantity/Remove/cash/Confirm Payment are locked after payment.
   Close with Close or Escape, then reopen using View Receipt.
9. Use New Transaction. Check empty cart, ₱0.00 total, blank cash, dash change,
   cleared messages/receipt, hidden View Receipt, and restored Add controls.
10. Repeat the primary order with `250`: accept with ₱50.00 change and the next
    sequential reference. Invalid payments must not consume a reference.
11. Add all six products. On a desktop viewport of at least 1100 × 720 CSS pixels
    at 100% zoom, check all six cart rows and payment fit without page scrolling.
    Check the six-item receipt overlay and take screenshots. Smaller windows or
    enlarged text may scroll; content is not clipped to force a fit.
12. Complete one uninterrupted add → adjust → review → pay → receipt → new
    transaction flow. Check mouse and keyboard operation and resize the window.
