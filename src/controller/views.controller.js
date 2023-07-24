import { ProductsService } from "../services/products.services.js";
import { CartsService } from "../services/carts.services.js";
import { UserService } from "../services/users.services.js";
const Users = new UserService()
const Products = new ProductsService()
const Carts = new CartsService()

class ViewsController{
      async getAll (req, res){
        try{
          // OBTENGO LOS QUERYS PARA VISTA DE PRODUCTOS
          var currentUrl = req.url
          const {page} = req.query;
          const {limit}= req.query;
          const {maxPrice}= req.query;
          const {order}= req.query;
          const category = req.query.category || "";
          // BUSCO LOS PRODUCTOS SEGUN EL QUERY
          const data = await Products.getProducts(limit,page,category,order,maxPrice,currentUrl);
          let products = data.products;
          let pagination = data.pagination;
          // BUSCO SI EXISTE SESSION Y USUARIO
          let firstNameUser ="";
          if(req?.session?.user?.email){
            let email = req.session.user.email
            var usuarioEncontrado = await Users.findOnebyEmail(email)
            firstNameUser = usuarioEncontrado.firstName;
          }
          return res.status(201).render('products',{products, pagination,firstNameUser,});
        }catch(e){
          console.log(e)
        }
     }
     async getCardbyId(req, res)  {
      try{
        const idCart = JSON.stringify(req.params.cid);
        let  products = await  Carts.getById(idCart);
        return res.status(201).render('cart',{products,idCart});
        }catch(e){
          return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
            });
          }}
      async showSession  (req, res)  {
        try{
         const dataSession = req.session;
         return res.status(201).send(JSON.stringify(dataSession));
          }catch(e){
          return res.status(500).json({ });
          }}
      async logout (req, res){
        req.session.destroy(err => {
        if (err) {
          return res.json({ status: 'Logout ERROR', body: err })
            }
          res.send('Logout ok!')
            })
          }
}
export const viewsController = new ViewsController();