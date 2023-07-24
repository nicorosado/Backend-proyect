import { UserModel } from "../DAO/models/user.models.js";

export class UserService{
    
    async getAll(){
      const users = await UserModel.find({});
      return users;
    }
    validate(firstName, lastName ,email){
        if (!firstName || !lastName || !email) {
            console.log(
              "validation error: please complete firstName, lastname and email."
            );
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
       return ({firstName, lastName ,email})
    }
    
    async findOnebyEmail(email){
      let user = await UserModel.findOne({email:email})
      return user;
    }

    async createOne(firstName, lastName, email){
        this.validate(firstName, lastName, email);
        const userCreated = await UserModel.create({ firstName, lastName, email });
        return userCreated;
    }
    
    async deletOne(_id){
       try{
          if(_id){
             let productDelet = await UserModel.deleteOne({_id: _id});
             return productDelet;
        }
       }
      catch(e){
        throw  new Error("Nuevo error")     
      }
    }
  
    async addCart(email,id){
      let data = await  UserModel.updateOne({ email },{ $set: { cart: id } })
      return data;
    }

    async updateOne(_id,firstName, lastName, email){
      try{
          this.validate(firstName, lastName, email);
          const userUptaded = await UserModel.updateOne( { _id: _id },{ firstName, lastName, email });
          return userUptaded;
       }
      catch(e){
      throw  new Error("Id no encontrado")     
      }
   }

   
}