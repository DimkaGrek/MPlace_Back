import MessengerDto from "../dtos/MessengerDto.js";
import Messenger from "../models/Messenger.js";

const add = async (messenger) => {
    const createdMessenger = await Messenger.create({
        name: messenger,
    });
    console.log("createdMessenger ->>> ", createdMessenger);
    return new MessengerDto(createdMessenger);
};

const get = async () => {
    const messengers = await Messenger.findAll({
        attributes: ["MessengerId", "name"],
        raw: true,
    });
    console.log("messengers ->>> ", messengers);

    return messengers;
};

export default {
    add,
    get,
};
