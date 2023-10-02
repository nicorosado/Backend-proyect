export class UserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.isPremium = user.isPremium;
        this.role = user.role;
    }

}

