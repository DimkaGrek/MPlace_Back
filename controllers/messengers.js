import MessengerService from "../services/MessengerService.js";

export const addMessengerHandler = async (req, res, next) => {
    try {
        const { messenger } = req.body;
        const data = await MessengerService.add(messenger);

        return res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

export const getMessengerHandler = async (req, res, next) => {
    try {
        const data = await MessengerService.get();

        return res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};
