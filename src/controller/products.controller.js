import { ProductsService } from "../services/products.services.js";

const Products = new ProductsService()

class ProductsController{
 async getAll(req, res)  {
    try {
        var currentUrl = req.url
        const {page} = req.query;
        const {limit}= req.query;
        const {maxPrice}= req.query;
        const {order}= req.query;
        const category = req.query.category || "";
        const data = await Products.getProducts(limit,page,category,order,maxPrice,currentUrl);
        return res.status(200).json({
        status: "success",
        msg: "listado de productos",
        data: data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }
  async getbyId (req, res) {
    try{
      const _id = req.params.id;
      const data = await Products.getById(_id);
      return res.status(200).json({
        status: "success",
        msg: "product",
        data: data,
      });
    }catch(e){
      return res.status(400).json({
        status: "error",
        msg: "producto no encontrado",
        data: {},
      }); 
    }
  }

  async createOne(req, res) {
    try{
     let newProduct = req.body;
     newProduct.thumbnail = "/"+ req.file.filename;
     const productCreated = await Products.createOne(newProduct);
       return  res.status(200).json({
                status: "success",
                msg: "product created",
                data: productCreated,
              });;
     } catch(e) {
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
      }
    }
    async updateOne (req, res) {
        const datosNuevosUsuario = req.body;
        const idSearch = req.params.id;
        let product = await productManager.updateProduct(idSearch,datosNuevosUsuario);
        return res.status(200).json({product})
        }
    async deletOne  (req, res)  {
        try{
        const _id = req.params.id;
        const productDelet= await Products.deletOne(_id);
        return res.status(200).json({
          status: "success",
          msg: "product deleted",
          data: productDelet,
        });
        }catch(e){
          res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
          });
        }
          
      }
}



export const productsController = new ProductsController();