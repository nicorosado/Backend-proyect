import { cartService } from '../services/cartService.js';
import { productService } from '../services/productService.js';

class CartsController {

    async getCarts(req, res) {
        try {
            const limit = req.query.limit;
            const carts = await cartService.getCarts(limit);
            res.status(200).json({ carts: carts });
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };

    async getCartById(req, res) {
        try {
            const cart = await cartService.addCart();
            res.status(201).json(cart);
        } catch (err) {
            res.status(400).json({ Error: `${err}` });
        };
    };

    async getProductsByCartId(req, res) {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getProductsByCartId(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };

    async addCart(req, res) {
        try {
            const cart = await cartService.addCart();
            res.status(201).json(cart);
        } catch (err) {
            res.status(400).json({ Error: `${err}` });
        };
    };

    async addProductToCart(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const productQuantity = req.body.quantity;
            const cart = await cartService.addProductToCart(cid, pid, productQuantity);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };

    async deleteProductFromCart(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const productQuantity = req.body.quantity;
            const cart = await cartService.deleteProductFromCart(cid, pid, productQuantity);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };

    async emptyCart(req, res) {
        try {
            const cid = req.params.cid;
            const cart = await cartService.emptyCart(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };

    async deleteCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.deleteCart(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };

    async getProductsByCartId_Handlebars(req, res) {
        try {
            const cid = req.params.cid;
            const cartProducts = await cartService.getProductsByCartId(cid);
            res.status(200).render("cartProducts", cartProducts);
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };

    async getProductsByCartId_Paginate(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page);
            const filter = req.query.filter || '';
            const sort = req.query.sort ? req.query.sort : '';
            const attName = req.query.attName || '';
            const sessionUser = req.session.user;
            let displayedProducts;
            const products = await productService.getProductsPaginate(limit, page, filter, sort, attName);
            const filteredProducts = products.docs.filter(product => product.owner !== sessionUser._id);
            sessionUser.isPremium === false ? displayedProducts = products.docs : displayedProducts = filteredProducts;
            const oldCartUnfinished = await cartService.getProductsByCartId(sessionUser.idCart);
            res.status(200).render('store', { displayedProducts, sessionUser, oldCartUnfinished });
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };
}

export const cartsController = new CartsController();
