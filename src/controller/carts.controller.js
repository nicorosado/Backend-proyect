import { CartsService } from "../services/carts.services.js";
import { UserService } from "../services/users.services.js";

const Carts = new CartsService()
const Users = new UserService()
class CartController{
 async creatCart (req, res)  {
    try{
       let cartCreate = await  Carts.createOne()
        if(req?.session?.user){
            let userSession = req.session.user
            let email = userSession.email
            await Users.findOnebyEmail(email);
            req.session.user.cart= cartCreate._id;
            await Users.addCart(email,cartCreate._id)
         }
       return res.status(201).json({
       message:"carrito creado ",
       data: cartCreate});  
    }catch(e){
        res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
      }
    }
    async addProductToCart (req, res) {
        try{
           const idCart = req.params.cid;
           const idProduct = req.params.pid;
           let  addProduct = await  Carts.addProdductCart(idCart,idProduct)
        
           return res.status(200).json({
              status: "success",
              msg: "Product add",
              data: addProduct,
            });
        }catch(e){
           return res.status(500).json({
              status: "error",
              msg: "something went wrong :(",
              data: {},
            });
        }
        }
        async deletOneProductbyCart  (req, res)  {
            try{
             const idCart = req.params.cid;
            const idProduct = req.params.pid;
            let  deletProduct = await  Carts.deletProductCart(idCart,idProduct)
            return   res.status(200).json({
               status: "success",
               msg: "Product eliminado",
               data: deletProduct,
             });
            }catch(e){
               return res.status(500).json({
                  status: "error",
                  msg: "something went wrong :(",
                  data: {},
                });
            }
            }
            async getById  (req, res)  {
                try{
                   const idCart = req.params.cid;
                   let  cartById = await  Carts.getById(idCart);
                 return res.status(200).json({
                      status: "success",
                      msg: "Cart found",
                      data: cartById,
                    });
                }catch(e){
                   return res.status(500).json({
                      status: "error",
                      msg: "something went wrong :(",
                      data: {},
                    });
                }
                }
            async getCarts   (req, res)  {
                try{
                   let  carts = await  Carts.getAll();
                   return res.status(200).json({
                      status: "success",
                      msg: "Carts found",
                      data: carts,
                    });
                }catch(e){
                   return res.status(500).json({
                      status: "error",
                      msg: "something went wrong :(",
                      data: {},
                    });
                }
              
             
                }
}

export const cartController = new CartController();