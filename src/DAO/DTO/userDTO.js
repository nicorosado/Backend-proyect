export class UserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.isPremium = user.isPremium;
        this.role = user.role;
        this.lastLoginDate = user.lastLoginDate;
        this.age = user.age;
        this.idCart = user.idCart;
        this.password = user.password;
        this._id = user._id;
    }

}

