const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    fs.writeFileSync(this.path, JSON.stringify(this.products));
    const productString = fs.readFileSync(this.path, "utf-8");
    const products = JSON.parse(productString);
    this.products = products;
    this.currentId = 0;
  }
  addProduct(product) {
    if (this.products.some((item) => item.code === product.code)) {
      return "Product already exists";
    }

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return "missing properties";
    }

    product = { id: this.currentId++, ...product };
    this.products.push(product);
    const productsString = JSON.stringify(this.products);
    fs.writeFileSync(this.path, productsString);
    return "Product added";
  }

  getProductById(id) {
    let found = this.products.find((product) => product.id === id);
    if (!found) {
      return "Product not found";
    }
    return this.products.find((product) => product.id === id);
  }

  getProducts() {
    if (this.products.length > 0) {
      return this.products;
    } else {
      return [];
    }
  }

  updateProduct(id, newValues) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      return "Product not found";
    }

    const updatedProduct = { ...this.products[productIndex], ...newValues };

    if (updatedProduct.id !== id) {
      return "Product ID cannot be changed";
    }

    this.products[productIndex] = updatedProduct;

    const productsString = JSON.stringify(this.products);
    fs.writeFileSync(this.path, productsString);

    return "Product updated";
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      return "Product not found to delete";
    }

    this.products.splice(productIndex, 1);

    const productsString = JSON.stringify(this.products);
    fs.writeFileSync(this.path, productsString);

    return "Product deleted";
  }
}

/* tests */

product1 = {
  title: "producto prueba",
  description: "Este es un producto prueba 1",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};

const updatedProduct = {
  title: "Producto actualizado",
  description: "nuevo producto",
  price: 20.99,
  thumbnail: "abc123",
  code: "PRUEBA",
  stock: 50,
};

const productManager = new ProductManager("products.json");

console.log(productManager.getProducts());

productManager.addProduct(product1);

console.log(productManager.getProducts());

console.log(productManager.getProductById(0));
console.log(productManager.getProductById(1));

productManager.updateProduct(0, updatedProduct);

console.log(productManager.getProducts());

console.log(productManager.deleteProduct(0));
