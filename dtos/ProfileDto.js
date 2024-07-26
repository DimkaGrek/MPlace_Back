class ProfileDto {
    userId;
    firstName;
    lastName;
    email;
    avatar;
    phone;

    constructor(model) {
        this.userId = model.userId;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.email = model.email;
        this.avatar = model.avatar;
        this.phone = model.phone;
    }
}

export default ProfileDto;
