// Official Scenario 4 catalog. Cart and payment behavior are later checkpoints.
const products = [
  { id: "classic-burger", name: "Classic Burger", price: 55 },
  { id: "cheeseburger", name: "Cheeseburger", price: 65 },
  { id: "ham-sandwich", name: "Ham Sandwich", price: 40 },
  { id: "french-fries", name: "French Fries (Regular)", price: 45 },
  { id: "nachos", name: "Nachos", price: 50 },
  { id: "soda", name: "Soda (Can)", price: 25 }
];

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
    button.disabled = true;
    button.setAttribute("aria-label", `Add ${product.name} to cart`);
    button.setAttribute("aria-describedby", "catalog-note");

    details.append(name, price);
    row.append(details, button);
    productList.append(row);
  });
}

renderProducts();
