import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.currentId = 1;
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
    const products = await this.getProducts();
    if (products.some((item) => item.code === product.code)) {
      return "Product already exists";
    }

    product = { id: this.currentId++, ...product };
    products.push(product);
    const productsString = JSON.stringify(products, null, 2);
    try {
      await fs.promises.writeFile(this.path, productsString);
      return "Product added";
    } catch (error) {
      return "Error adding product";
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const found = products.find((product) => product.id === id);
    if (!found) {
      return "Product not found";
    }
    return found;
  }

  async getProducts() {
    try {
      const productString = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(productString);
      return products;
    } catch (error) {
      return [];
    }
  }

  async updateProduct(id, newValues) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return "Product not found";
    }

    const { id: _id, ...updateData } = newValues;
    const updatedProduct = {
      ...products[productIndex],
      ...updateData,
    };

    products[productIndex] = updatedProduct;

    const productsString = JSON.stringify(products, null, 2);
    try {
      await fs.promises.writeFile(this.path, productsString);
      return "Product updated";
    } catch (error) {
      return "Error updating product";
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return "Product not found to delete";
    }

    products.splice(productIndex, 1);

    const productsString = JSON.stringify(products, null, 2);
    try {
      await fs.promises.writeFile(this.path, productsString);
      return "Product deleted";
    } catch (error) {
      return "Error deleting product";
    }
  }
}

const product1 = {
  title: "producto prueba",
  description: "Este es un producto prueba 1",
  price: 200,
  thumbnail: "Sin imagen",
  code: "1",
  stock: 25,
};
const product2 = {
  title: "producto prueba",
  description: "Este es un producto prueba 1",
  price: 200,
  thumbnail: "Sin imagen",
  code: "2",
  stock: 25,
};
const product3 = {
  title: "producto prueba",
  description: "Este es un producto prueba 1",
  price: 200,
  thumbnail: "Sin imagen",
  code: "3",
  stock: 25,
};

const updatedProduct = {
  title: "Producto actualizado",
  description: "nuevo producto",
  price: 20.99,
  thumbnail: "dsadsadsa",
  code: "PRUEBA",
  stock: 50,
};

async function test() {
  const productManager = new ProductManager("./src/products.json");

  console.log(await productManager.getProducts());

  await productManager.addProduct(product1);
  await productManager.addProduct(product2);
  await productManager.addProduct(product3);

  console.log(await productManager.getProductById(1));
  console.log(await productManager.getProductById(2));

  await productManager.updateProduct(1, updatedProduct);
  console.log(productManager.currentId);
}

/* test(); */
