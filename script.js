// Official Scenario 4 catalog. Only matching local photos are used.
const products = [
  { id: "classic-burger", name: "Classic Burger", price: 55, image: "pitures/classic burg.jpg" },
  { id: "cheeseburger", name: "Cheeseburger", price: 65, image: "pitures/burger cheese.jpg" },
  { id: "ham-sandwich", name: "Ham Sandwich", price: 40, image: "pitures/ham sandwich.jpg" },
  { id: "french-fries", name: "French Fries (Regular)", price: 45, image: "pitures/regular french fries.jpg" },
  { id: "nachos", name: "Nachos", price: 50 },
  { id: "soda", name: "Soda (Can)", price: 25 }
];

// One entry per product: { productId, quantity }. Data lasts until page reload.
let cart = [];
let transactionCompleted = false;
let transactionNumber = 1;

function formatCurrency(amount) {
  return `₱${amount.toFixed(2)}`;
}

function renderProducts() {
  const productList = document.getElementById("product-list");

  products.forEach((product) => {
    const row = document.createElement("article");
    row.className = "product-row";

    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatCurrency(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-button";
    button.textContent = "Add to Cart";
    button.setAttribute("aria-label", `Add ${product.name} to cart`);
    button.setAttribute("aria-describedby", "catalog-note");
    button.addEventListener("click", () => addToCart(product.id));

    details.append(name, price);
    const productInfo = document.createElement("div");
    productInfo.className = "product-info";
    if (product.image) {
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      image.className = "product-image";
      image.width = 72;
      image.height = 72;
      productInfo.append(image);
    }
    productInfo.append(details);
    row.append(productInfo, button);
    productList.append(row);
  });
}

function addToCart(productId) {
  if (transactionCompleted) return;
  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  renderCart();
}

function changeQuantity(productId, adjustment) {
  if (transactionCompleted) return;
  const item = cart.find((item) => item.productId === productId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + adjustment);
    renderCart();
  }
}

function removeItem(productId) {
  if (transactionCompleted) return;
  cart = cart.filter((item) => item.productId !== productId);
  renderCart();
}

function calculateTotal() {
  return cart.reduce((total, item) => {
    const product = products.find((product) => product.id === item.productId);
    return total + product.price * item.quantity;
  }, 0);
}

function createCartButton(label, accessibleLabel, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", accessibleLabel);
  button.addEventListener("click", action);
  return button;
}

function renderCart() {
  const container = document.getElementById("cart-items");
  // Keep focus on the same quantity control after rebuilding the summary.
  const focusedControl = document.activeElement;
  const focusLabel = container.contains(focusedControl)
    ? focusedControl.getAttribute("aria-label") : null;
  container.replaceChildren();
  container.className = cart.length ? "cart-items" : "empty-state";

  if (cart.length === 0) {
    const title = document.createElement("p");
    title.className = "empty-title";
    title.textContent = "Your cart is empty";
    const hint = document.createElement("p");
    hint.textContent = "Choose a product using Add to Cart.";
    container.append(title, hint);
  }

  cart.forEach((item) => {
    const product = products.find((product) => product.id === item.productId);
    const row = document.createElement("article");
    row.className = "cart-item";
    const name = document.createElement("h3");
    name.textContent = product.name;
    const unitPrice = document.createElement("p");
    unitPrice.className = "cart-unit-price";
    unitPrice.textContent = `Unit price: ${formatCurrency(product.price)}`;
    const subtotal = document.createElement("p");
    subtotal.className = "cart-subtotal";
    subtotal.textContent = `Subtotal: ${formatCurrency(product.price * item.quantity)}`;
    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    const decrease = createCartButton("−", `Decrease ${product.name} quantity`,
      () => changeQuantity(product.id, -1));
    decrease.disabled = transactionCompleted || item.quantity === 1;
    const quantity = document.createElement("span");
    quantity.textContent = `Qty: ${item.quantity}`;
    const increase = createCartButton("+", `Increase ${product.name} quantity`,
      () => changeQuantity(product.id, 1));
    const remove = createCartButton("Remove", `Remove ${product.name}`,
      () => removeItem(product.id));
    increase.disabled = transactionCompleted;
    remove.disabled = transactionCompleted;
    controls.append(decrease, quantity, increase, remove);
    row.append(name, unitPrice, subtotal, controls);
    container.append(row);
  });

  document.getElementById("total-amount").textContent = formatCurrency(calculateTotal());
  updateChange();
  if (focusLabel) {
    const replacement = Array.from(container.querySelectorAll("button"))
      .find((button) => button.getAttribute("aria-label") === focusLabel);
    if (replacement && !replacement.disabled) replacement.focus();
    else document.getElementById("cart-heading").focus();
  }
}

function updateChange() {
  if (transactionCompleted) return;
  const cashInput = document.getElementById("cash-payment");
  const amountPaid = Number(cashInput.value);
  // This is a computation preview, not payment approval or validation.
  document.getElementById("change-amount").textContent =
    cashInput.value.trim() === "" || !Number.isFinite(amountPaid)
      ? "—" : formatCurrency(amountPaid - calculateTotal());
}

function showPaymentMessage(message, isError = false) {
  const output = document.getElementById("payment-message");
  output.textContent = message;
  output.className = isError ? "payment-error" : "payment-success";
  document.getElementById("cash-payment").setAttribute("aria-invalid", String(isError));
}

function confirmPayment() {
  if (transactionCompleted) return;
  const cashInput = document.getElementById("cash-payment");
  const rawCash = cashInput.value.trim();
  const amountPaid = Number(rawCash);
  const total = calculateTotal();
  let error = "";
  if (cart.length === 0) error = "Please add at least one item to the cart.";
  else if (rawCash === "") error = "Please enter a cash payment amount.";
  else if (!Number.isFinite(amountPaid) || !/^-?(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/.test(rawCash)) {
    error = "Please enter a valid numeric cash amount with up to two decimal places.";
  } else if (amountPaid < 0) error = "Payment cannot be negative.";
  else if (amountPaid < total) error = `Insufficient payment. Please enter at least ${formatCurrency(total)}.`;
  if (error) {
    showPaymentMessage(error, true);
    cashInput.focus();
    return;
  }

  const change = Math.round((amountPaid - total) * 100) / 100;
  const reference = `TXN-${String(transactionNumber).padStart(3, "0")}`;
  transactionNumber += 1;
  transactionCompleted = true;
  renderCart();
  document.getElementById("change-amount").textContent = formatCurrency(change);
  showPaymentMessage(`Payment successful. Paid ${formatCurrency(amountPaid)} · Change ${formatCurrency(change)}.`);
  cashInput.disabled = true;
  document.getElementById("confirm-payment").disabled = true;
  document.getElementById("view-receipt").hidden = false;
  document.getElementById("product-list").querySelectorAll("button").forEach((button) => { button.disabled = true; });
  renderReceipt(reference, total, amountPaid, change);
  document.getElementById("receipt-dialog").showModal();
}

function renderReceipt(reference, total, amountPaid, change) {
  const receipt = document.getElementById("receipt");
  receipt.replaceChildren();
  const referenceLine = document.createElement("p");
  referenceLine.className = "receipt-reference";
  referenceLine.textContent = `Transaction reference: ${reference}`;
  receipt.append(referenceLine);
  const table = document.createElement("table");
  const head = document.createElement("thead");
  const headingRow = document.createElement("tr");
  ["Item", "Qty", "Subtotal"].forEach((label) => {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = label;
    headingRow.append(cell);
  });
  head.append(headingRow);
  const body = document.createElement("tbody");
  cart.forEach((item) => {
    const product = products.find((product) => product.id === item.productId);
    const row = document.createElement("tr");
    [product.name, String(item.quantity), formatCurrency(product.price * item.quantity)].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    body.append(row);
  });
  table.append(head, body);
  receipt.append(table);
  [["Total Amount", total], ["Amount Paid", amountPaid], ["Change", change]].forEach(([label, amount]) => {
    const line = document.createElement("p");
    line.className = "receipt-total";
    const title = document.createElement("span");
    title.textContent = label;
    const value = document.createElement("strong");
    value.textContent = formatCurrency(amount);
    line.append(title, value);
    receipt.append(line);
  });
}

function newTransaction() {
  const dialog = document.getElementById("receipt-dialog");
  if (dialog.open) dialog.close();
  cart = [];
  transactionCompleted = false;
  const cashInput = document.getElementById("cash-payment");
  cashInput.value = "";
  cashInput.disabled = false;
  cashInput.setAttribute("aria-invalid", "false");
  document.getElementById("payment-message").textContent = "";
  document.getElementById("payment-message").className = "";
  document.getElementById("receipt").replaceChildren();
  document.getElementById("confirm-payment").disabled = false;
  document.getElementById("view-receipt").hidden = true;
  const addButtons = document.getElementById("product-list").querySelectorAll("button");
  addButtons.forEach((button) => { button.disabled = false; });
  renderCart();
  addButtons[0].focus();
}

renderProducts();
renderCart();
document.getElementById("cash-payment").addEventListener("input", updateChange);
document.getElementById("confirm-payment").addEventListener("click", confirmPayment);
document.getElementById("new-transaction").addEventListener("click", newTransaction);
document.getElementById("receipt-new-transaction").addEventListener("click", newTransaction);
document.getElementById("close-receipt").addEventListener("click", () => document.getElementById("receipt-dialog").close());
document.getElementById("view-receipt").addEventListener("click", () => {
  if (transactionCompleted) document.getElementById("receipt-dialog").showModal();
});
