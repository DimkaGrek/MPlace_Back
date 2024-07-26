class UserDto {
    email;
    id;
    isActivated;
    username;

    constructor(model) {
        this.email = model.email;
        this.id = model.userId;
        this.isActivated = model.isActivated;
        this.username = model.firstName;
    }
}

export default UserDto;
