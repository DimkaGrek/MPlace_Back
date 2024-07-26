class MessengerDto {
    MessengerId;
    name;

    constructor(model) {
        this.MessengerId = model.MessengerId;
        this.name = model.name;
    }
}

export default MessengerDto;
