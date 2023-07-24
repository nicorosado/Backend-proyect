import fs from 'fs'
import productManager from './productManager.js';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    async getCarts(){
        if (fs.existsSync(this.path)) {
                    const cartsString = await fs.promises.readFile(this.path, "utf-8");
                    const carts = JSON.parse(cartsString);
                    this.carts = carts;

                } else {
                    await fs.promises.writeFile(this.path, "[]");
                    const cartsString = await fs.promises.readFile(this.path, "utf-8");
                    const carts = JSON.parse(cartsString);
                    this.carts = carts;
                }
                return this.carts
            
    }

        async addCart(idCart){
            let carts = await this.getCarts();
            let products =  [];
            if (carts.some((cart) => cart.id === idCart)) {
                 return { error: `el cart  con id: ",${idCart}, existe` };
            }
            let id = idCart;
            let newCart = {id,products}
            carts.push(newCart);
            const cartsString = JSON.stringify(carts, null, 2);
            await fs.promises.writeFile(this.path, cartsString);

            return newCart;

        }
        async addPrdoductToCart(idCart,idProduct){
            try{
                let data = await this.getCarts();
                let cart = await this.getCartById(idCart);
                if(cart){
                    let product= await productManager.getProductsById(idProduct);
                    if(product){
                     const producFind = cart.products.find( product => product.idProduct === idProduct);
                     if(producFind){
                        producFind.quantity = producFind.quantity +1  ;
                        let cartIndex = data.findIndex(cart => cart.id === idCart)
                        data.splice(cartIndex, 1, cart)
                        const cartString = JSON.stringify(data, null, 2)
                        await fs.promises.writeFile(this.path, cartString); 
                        return cart;
                }
                    cart.products.push({idProduct: idProduct, quantity: 1})
                    let cartIndex = data.findIndex(cart => cart.id === idCart)
                    data.splice(cartIndex, 1, cart)
                    const cartString = JSON.stringify(data, null, 2)
                    await fs.promises.writeFile(this.path, cartString);
                    return cart; 
            }
            return {error: "producto no existe"}
            }
                return {error: "cart no existe"}
            
           }
           catch (e) {
            return new Error(e);
        }
        }

        async getCartById(idSearch){
            try {
                let data = await this.getCarts();
                const cartByid = await this.getCartIndex(idSearch);
                if(cartByid) {
                     return cartByid; 
                                }   
    
            } catch (error) {
                throw new Error(error)
            }
        }
        async getCartIndex(idSearch){
            let data = await this.getCarts();
            try {
                const cartIndexByid = data.find(element => element.id === idSearch);

                if(cartIndexByid) {
                    
                     return cartIndexByid; 
                                }   
    
            } catch (error) {
                throw new Error(error)
            }
        }




}
 
 

//const cart = new CartManager("./src/persistencia/carts.json");



export default new CartManager("./src/persistencia/carts.json");

