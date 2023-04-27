import express from "express";
import { ProductManager } from "./ProductManager.js";
const app = express();
const productManager = new ProductManager("./src/products.json");
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

app.get("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await productManager.getProductById(id);
  console.log(product);
  if (product) {
    res.json(product);
  } else {
    res.json({ error: "Product not found" });
  }
});

app.listen(PORT, () => {
  console.log(`listening on PORT: http://localhost:${PORT}`);
});
