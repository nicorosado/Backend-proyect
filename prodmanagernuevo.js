const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.currentId = 1;
    this.products = [];
    (async () => {
      try {
        const productString = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(productString);
        this.products = products;
        this.currentId = products[products.length - 1]?.id || 1;
      } catch (error) {
        await fs.promises.writeFile(this.path, JSON.stringify([]));
      }
    })();
  }

  async addProduct(product) {
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

    if (this.products.some((item) => item.code === product.code)) {
      return "Product already exists";
    }

    product = { id: this.currentId + 1, ...product };
    this.products.push(product);
    const productsString = JSON.stringify(this.products);
    try {
      await fs.promises.writeFile(this.path, productsString);
      return "Product added";
    } catch (error) {
      console.error("Error adding product", error);
      return "Error adding product";
    }
  }

  async getProductById(id) {
    const found = this.products.find((product) => product.id === id);
    if (!found) {
      return "Product not found";
    }
    return found;
  }

  async getProducts() {
    return this.products;
  }

  async updateProduct(id, newValues) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      return "Product not found";
    }

    const { productId, ...updateData } = newValues;
    const updatedProduct = {
      ...this.products[productIndex],
      ...updateData,
      id: productId,
    };

    this.products[productIndex] = updatedProduct;

    const productsString = JSON.stringify(this.products);
    try {
      await fs.promises.writeFile(this.path, productsString);
      return "Product updated";
    } catch (error) {
      console.error("Error updating product", error);
      return "Error updating product";
    }
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      return "Product not found to delete";
    }

    this.products.splice(productIndex, 1);

    const productsString = JSON.stringify(this.products);
    try {
      await fs.promises.writeFile(this.path, productsString);
      return "Product deleted";
    } catch (error) {
      console.error("Error deleting product", error);
      return "Error deleting product";
    }
  }
}

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

async function sinSentido() {
  const productManager = new ProductManager("products.json");

  console.log(await productManager.getProducts());

  await productManager.addProduct(product1);

  console.log(await productManager.getProducts());

  console.log(await productManager.getProductById(1));
  console.log(await productManager.getProductById(2));

  await productManager.updateProduct(1, updatedProduct);

  console.log(await productManager.getProducts());

  console.log(await productManager.deleteProduct(1));
}

sinSentido();
