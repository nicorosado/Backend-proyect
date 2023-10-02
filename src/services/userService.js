
import { userDAO } from '../DAO/userDAO.js';
import { CartService } from '../services/cartService.js';
import { createHash } from '../utils/bcrypt.js';
//--

const cartService = new CartService;

export class UserService {
  async register(res) {
    return res.render('register', {});
  };

  registerFail(res) {
    return res.json({ error: 'fail to register' });
  };

  loginFail(res) {
    return res.json({ error: 'fail to login' });
  };

  async dashboard(req, res) {
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      role: req.user.role,
      isPremium: req.user.isPremium,
      idCart: req.user.idCart
    };
    return res.redirect('/dashboard')
  };

  async getUsers(limit, filter) {
    try {
      const users = await userDAO.getUsers(limit, filter);
      return users;
    } catch (err) {
      throw err;
    }
  };

  // USER NUEVO
  async addUser(newUser) {
    try {
      const users = await this.getUsers();
      const userExist = users.some((user) => user.email == newUser.email);
      if (userExist) {
        throw ("Ya existe el Usuario que desea ingresar.");
      };
      //Creo Carrito
      const cartId = await cartService.addCart()
      //Armo datos Usuario
      const userToCreate = {
        email: newUser.email && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(newUser.email) ? newUser.email : (() => { throw ("Debe ingresar un Email válido.") })(),
        firstName: newUser.firstName ? newUser.firstName : (() => { throw ("Debe ingresar Nombre.") })(),
        lastName: newUser.lastName ? newUser.lastName : (() => { throw ("Debe ingresar Apellido.") })(),
        age: newUser.age ? newUser.age : '80',
        isPremium: true,
        role: 'user',
        password: createHash(newUser.password),
        idCart: cartId._id,
        lastLoginDate: new Date()
      };
      let createdUser = await userDAO.addUser(userToCreate);
      return createdUser;
    } catch (err) {
      throw (`Error al agregar Usuario. ${err}`);
    };
  };

  async updateUser(id, fieldsToUpdate) {
    try {
      const userToUpdate = { ...fieldsToUpdate };
      for (const field in fieldsToUpdate) {
        switch (field) {
          case "email":
            userToUpdate.email = fieldsToUpdate.email !== "" ? fieldsToUpdate.email : (() => { throw ("Debe ingresar un email.") })();
            break;
          case "firstName":
            userToUpdate.firstName = fieldsToUpdate.firstName !== "" ? fieldsToUpdate.firstName : (() => { throw ("Debe ingresar Nombre.") })();
            break;
          case "lastName":
            userToUpdate.lastName = fieldsToUpdate.lastName !== "" ? fieldsToUpdate.lastName : (() => { throw ("Debe ingresar Apellido.") })();
            break;
          case "age":
            userToUpdate.age = fieldsToUpdate.age !== "" ? fieldsToUpdate.age : (() => { throw ("Debe ingresar su Edad(Cantidad de años).") })();
            break;
          case "role":
            userToUpdate.role = fieldsToUpdate.role !== "" ? fieldsToUpdate.role : "";
            break;
          case "isPremium":
            userToUpdate.isPremium = fieldsToUpdate.isPremium !== "" ? fieldsToUpdate.isPremium : "";
            break;
          case "lastLoginDate":
            userToUpdate.lastLoginDate = fieldsToUpdate.lastLoginDate !== "" ? fieldsToUpdate.lastLoginDate : Date.now()
            break;
          default:
            break;
        }
      };
      const userUpdated = await userDAO.updateUser({ _id: id }, userToUpdate);
      return userUpdated;
    } catch (err) {
      throw (`No se pudo modificar Usuario con ID ${id}. ${err}`);
    };
  };
  async getUserByIdOrEmail(id, email) {
    try {
      const users = await userDAO.getUsers();
      let _id, _email;
      if (id) {
        _id = users.find((user) => user._id.toString() === id.toString());
        _id && _id != undefined ? _id : _id = null;
        return _id
      } else if (email) {
        _email = users.find((user) => user.email.toString() === email.toString());
        _email && _email != undefined ? _email : null;
        return _email
      }
    } catch (err) {
      throw (`Fallo al buscar Usuario. ${err}`);
    }

  };
  // DELETE USUARIO
  async deleteUser(userid) {
    try {
      const idcartU = await this.getUserByIdOrEmail(userid, null)
      const deletedUser = await userDAO.deleteUser(userid);
      const cartIdUser = await cartService.getCartById(idcartU.idCart);
      await cartService.deleteCart(cartIdUser);
      return deletedUser;
    } catch (err) {
      throw (`Fallo al borrar el Usuario. ${err}`);
    };
  };


  //LLAVE FIN USER SERVICE
};

export const userService = new UserService();