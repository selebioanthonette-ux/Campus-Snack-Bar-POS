// Run with Node.js for verification only; the application needs no Node runtime.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

class Element {
  constructor(tag = "div") {
    this.tag = tag;
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.value = "";
    this.disabled = false;
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  addEventListener(event, callback) { this.listeners[event] = callback; }
  contains(element) { return this === element || this.children.some((child) => child.contains(element)); }
  querySelectorAll(tag) {
    return this.children.flatMap((child) => [
      ...(child.tag === tag ? [child] : []), ...child.querySelectorAll(tag)
    ]);
  }
  focus() { document.activeElement = this; }
  click() { if (!this.disabled) { this.focus(); this.listeners.click?.(); } }
}

const elements = {};
const document = {
  activeElement: null,
  createElement: (tag) => new Element(tag),
  getElementById: (id) => elements[id] ??= new Element()
};
const root = path.join(__dirname, "..");
const source = process.argv[2]
  ? fs.readFileSync(process.argv[2], "utf8")
  : fs.readFileSync(path.join(root, "script.js"), "utf8");
vm.runInNewContext(source, { document });
const catalog = elements["product-list"];
const cart = elements["cart-items"];
const total = () => elements["total-amount"].textContent;
const change = () => elements["change-amount"].textContent;
const add = (index) => catalog.children[index].querySelectorAll("button")[0].click();
const controls = (index) => cart.children[index].querySelectorAll("button");
const cash = (value) => {
  elements["cash-payment"].value = value;
  elements["cash-payment"].listeners.input();
};

assert.equal(catalog.children.length, 6);
assert.equal(catalog.children[0].querySelectorAll("button")[0].disabled, false,
  "Add to Cart must be enabled");
assert.equal(total(), "₱0.00");
add(0);
assert.equal(total(), "₱55.00");
add(0);
assert.equal(cart.children.length, 1, "Repeated Add must use one row");
assert.equal(cart.children[0].children[3].children[1].textContent, "Qty: 2");
assert.equal(cart.children[0].children[2].textContent, "Subtotal: ₱110.00");
add(2);
add(5);
add(5);
assert.equal(total(), "₱200.00");
assert.deepEqual(cart.children.map((row) => row.children[2].textContent),
  ["Subtotal: ₱110.00", "Subtotal: ₱40.00", "Subtotal: ₱50.00"]);
cash("250");
assert.equal(change(), "₱50.00");
controls(0)[1].click();
assert.equal(total(), "₱255.00");
assert.equal(change(), "₱-5.00");
assert.equal(document.activeElement.getAttribute("aria-label"), "Increase Classic Burger quantity");
controls(0)[0].click();
controls(0)[0].click();
assert.equal(total(), "₱145.00");
assert.equal(controls(0)[0].disabled, true);
controls(0)[0].click();
assert.equal(total(), "₱145.00", "Quantity cannot go below one");
controls(0)[2].click();
assert.equal(total(), "₱90.00");
assert.equal(change(), "₱160.00");
controls(0)[2].click();
controls(0)[2].click();
assert.equal(total(), "₱0.00");
assert.equal(cart.children[0].textContent, "Your cart is empty");
cash("");
assert.equal(change(), "—");
for (let i = 0; i < 6; i += 1) add(i);
assert.equal(total(), "₱280.00");
cash("280");
assert.equal(change(), "₱0.00");
const images = catalog.querySelectorAll("img");
assert.equal(images.length, 4);
images.forEach((image) => assert.ok(fs.existsSync(path.join(root, image.src)), image.src));
console.log("PASS: cart button actions, quantities, minimum, removal, subtotals, totals, cash input, change updates, focus restoration, and four local image paths.");
console.log("Tests use a minimal DOM stub; browser layout and actual image loading require manual testing.");
