import { UserService } from "../services/users.services.js";

const Service = new UserService();

class UserController{
 async getAll (req, res) {
    try {
      const users =await Service.getAll();
      return res.status(200).json({
        status: "success",
        msg: "listado de usuarios",
        data: users,
      });
    } catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }
  async getOnebyEmail (req, res)  {
    try{
    const email = req.params.email;
    userDelet = await Service.findOnebyEmail(email)
    return res.status(201).json({
      status: "success",
      msg: "user deleted",
      data: userDelet,
    });
    }catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }

  async deletOne (req, res){
    try{
    const _id = req.params.id;
    userDelet = await Service.deletOne(_id)
    return res.status(201).json({
      status: "success",
      msg: "user deleted",
      data: userDelet,
    });
    }catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }   
}
async updateOne (req, res) {
  const _id  = req.params.id;
  const { firstName, lastName, email } = req.body;
  try {
    let userUptaded = await Service.updateOne(_id,firstName, lastName, email)
    return res.status(201).json({
      status: "success",
      msg: "user uptaded",
      data: userUptaded,
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
}
}

export const userController = new UserController();