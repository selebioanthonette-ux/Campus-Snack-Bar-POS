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
  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  renderCart();
}

function changeQuantity(productId, adjustment) {
  const item = cart.find((item) => item.productId === productId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + adjustment);
    renderCart();
  }
}

function removeItem(productId) {
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
    decrease.disabled = item.quantity === 1;
    const quantity = document.createElement("span");
    quantity.textContent = `Qty: ${item.quantity}`;
    const increase = createCartButton("+", `Increase ${product.name} quantity`,
      () => changeQuantity(product.id, 1));
    const remove = createCartButton("Remove", `Remove ${product.name}`,
      () => removeItem(product.id));
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
  const cashInput = document.getElementById("cash-payment");
  const amountPaid = Number(cashInput.value);
  // This is a computation preview, not payment approval or validation.
  document.getElementById("change-amount").textContent =
    cashInput.value.trim() === "" || !Number.isFinite(amountPaid)
      ? "—" : formatCurrency(amountPaid - calculateTotal());
}

renderProducts();
renderCart();
document.getElementById("cash-payment").addEventListener("input", updateChange);
