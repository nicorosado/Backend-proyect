import { ProductsModel } from "../DAO/models/products.models.js";
import url from "url"
export class ProductsService{

    async getProducts(limit,page,category,order,maxPrice,currentUrl){
        let filters = {};
        let defaultOrder = 'asc';
         order = order || defaultOrder;
       if (maxPrice) {
        filters.price = { $lte: maxPrice };
        }
        if (category) {
            filters.category = { $regex: category, $options:'i' };
          }
         const dataProducts = await ProductsModel.paginate(filters,{limit:limit || 4 ,page: page || 1, sort:([['price', order]])});;
         const {docs, ...rest} = dataProducts;
         let products =  docs.map((doc)=>{
             return {id: doc.id,
                  title: doc.title, 
                  price:doc.price,
                  description: doc.description,
                  thumbnail: doc.thumbnail,
                  stock:doc.stock,
                 category: doc.category}
         })
         let pagination = rest;
         if(pagination.hasNextPage){
             let parsedUrl = url.parse(currentUrl,true)
             parsedUrl.query.page= pagination.nextPage;
             let nextLink = url.format({
                 pathname: parsedUrl.pathname,
                 query : parsedUrl.query,
             })
             pagination.nextLink = nextLink;
         }
         if(pagination.hasPrevPage){
             let parsedUrl = url.parse(currentUrl,true)
             parsedUrl.query.page= pagination.prevPage;
             let prevLink = url.format({
                 pathname: parsedUrl.pathname,
                 query : parsedUrl.query,
             })
             pagination.prevLink = prevLink;
         }
        return {products,pagination};
    }

    async getById(_id){
        const product = await ProductsModel.find({_id:_id})
        if(!product){
            throw new Error("validation error: id cannot finded");
        }
       return product;
   }
   
    async createOne(newProduct){
        try{
            if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail ||
               !newProduct.code ||
               !newProduct.category ||
               !newProduct.stock
            ){
                throw new Error("Complete campos")
            }
            let title = newProduct.title  ;
            let description = newProduct.description ;
            let price = parseInt(newProduct.price) ;
            let code = newProduct.code ;
            let stock = parseInt(newProduct.stock);
            let category = newProduct.category;
            let thumbnail =newProduct.thumbnail;
            const productCreated = await ProductsModel.create({ title, price,description,code,thumbnail,category,stock,});
            return productCreated;
         }catch(e){
            throw new Error("Complete campos")
            }
    }
    
    async deletOne(_id){
       try{
          if(_id){
             let productDelet = await ProductsModel.deleteOne({_id: _id});
             return productDelet;
        }
       }
      catch(e){
        throw  new Error("Nuevo error")     
      }
    }

    async updateOne(_id,firstName, lastName, email){
      try{
          this.validate(firstName, lastName, email);
          const userUptaded = await ProductsModel.updateOne( { _id: _id },{ firstName, lastName, email });
          return userUptaded;
       }
      catch(e){
      throw  new Error("Error")     
      }
   }

   
}