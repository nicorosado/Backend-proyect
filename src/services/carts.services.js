import { CartsModel } from "../DAO/models/carts.models.js";

export class CartsService {

    async getAll() {
        const carts = await CartsModel.find({}).populate("products.product");
        return carts;
    }
    async getById(idCart) {
        let cart = await CartsModel.findOne({ _id: idCart }).populate("products.product");
        let products = cart.products.map((doc) => {
            return {
                id: doc.product.id,
                title: doc.product.title,
                price: doc.product.price,
                description: doc.product.description,
                thumbnail: doc.product.thumbnail,
                stock: doc.product.stock,
                quantity: doc.quantity,
                subtotal: doc.quantity * doc.product.price,
                category: doc.product.category
            }
        })
        return products;
    }
    async createOne() {
        const cartCreated = await CartsModel.create({});

        console.log(cartCreated)
        return cartCreated;
    }
    async addProdductCart(idCart, idProduct) {
        try {
            let cart = await CartsModel.findOne({ _id: idCart });
            let productIndex = cart.products.findIndex(p => p.product.toString() === idProduct)
            if (productIndex === -1) {
                cart.products.push({ product: idProduct, quantity: 1 });
                await CartsModel.updateOne({ _id: idCart }, cart);
                return cart;
            }
            cart.products[productIndex].quantity++;
            await CartsModel.updateOne({ _id: idCart }, cart);
            return cart.products;
        } catch (e) {
            throw new Error("Error")
        }
    }
    async deletProductCart(idCart, idProduct) {
        try {
            let cart = await CartsModel.findOne({ _id: idCart });
            let productIndex = cart.products.findIndex(p => p.product.toString() === idProduct)
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity--;
                await CartsModel.updateOne({ _id: idCart }, cart);
                return cart;
            }
            cart.products.splice(productIndex, 1)
            await CartsModel.updateOne({ _id: idCart }, cart);
            return cart.products;
        } catch (e) {
            throw new Error("Error")
        }
    }




}