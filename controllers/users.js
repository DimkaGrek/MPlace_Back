import UserService from "../services/UserService.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError.js";
import User from "../models/Users/User.js";
import axios from "axios";
import queryString from "query-string";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

export const registrationHandler = async (req, res, next) => {
    try {
        const { email, password, repassword } = req.body;

        if (password != repassword) {
            throw ApiError.BadRequest("Password is not equal re-password");
        }

        const user = await UserService.registration(email, password);
        res.status(201).json({ userId: user.userId, email: user.email });
    } catch (error) {
        console.log(error);
        next(error);
        // return res.status(409).send('User already exists');
    }
};

export const activateHandler = async (req, res, next) => {
    try {
        const activationLink = req.params.link;
        const { userId, socialToken } = await UserService.activate(
            activationLink
        );

        console.log(
            `${process.env.CLIENT_URL}/success/1?userId=${userId}&info=${socialToken}`
        );
        res.redirect(
            `${process.env.CLIENT_URL}/success/1?userId=${userId}&info=${socialToken}`
        );
        // return res.status(200).json(userData);
    } catch (error) {
        console.log(error);
        next(error);
        // res.status(404).send(error.message);
    }
};

export const loginHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await UserService.login(email, password);
        res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const loginSocialHandler = async (req, res, next) => {
    try {
        const { userId, info } = req.body;
        const userData = await UserService.loginSocial(userId, info);
        res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const logoutHandler = async (req, res, next) => {
    try {
        // const { refreshToken } = req.cookies;
        const { refreshToken } = req.body;

        const token = await UserService.logout(refreshToken);
        res.clearCookie("refreshToken");
        return res.status(200).json(token);
    } catch (error) {
        next(error);
    }
};

export const sendRestoreNumberHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        await UserService.sendRestoreNumber(email);

        return res.status(200).json({ message: "Email sent succesfully" });
    } catch (error) {
        next(error);
    }
};

export const changePasswordHandler = async (req, res, next) => {
    try {
        const { restoreNumber, password, confirmPassword } = req.body;
        const userData = await UserService.changePassword(
            restoreNumber,
            password,
            confirmPassword
        );

        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const changeProfileHandler = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const userData = await UserService.changeProfile(userId, req.body);

        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const getProfileHandler = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const userData = await UserService.getProfile(userId);

        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const addAuthorHandler = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { description } = req.body;
        const userData = await UserService.addAuthor(userId, description);

        return res.status(201).json(userData);
    } catch (error) {
        next(error);
    }
};

export const getAuthorHandler = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const userData = await UserService.getAuthor(userId);

        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const addMemberHandler = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { description } = req.body;
        const userData = await UserService.addMember(userId, description);

        return res.status(201).json(userData);
    } catch (error) {
        next(error);
    }
};

export const getMemberHandler = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const userData = await UserService.getMember(userId);

        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const refreshHandler = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await UserService.refresh(refreshToken);
        res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.status(201).json(userData);
    } catch (error) {
        next(error);
    }
};

export const getSingleUserHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserService.findUserById(userId);
        if (user.length === 0) {
            res.status(404).send('{"No user found"}');
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).send("Error fetching user: " + error.message);
    }
};

export const createUserHandler = async (req, res) => {
    try {
        console.log("req.body: ", req.body);
        const userData = req.body;
        const user = await UserService.createUser(userData);
        res.status(201).json(user);
    } catch (error) {
        console.log(error.name);
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(409).send("User already exists");
        } else {
            res.status(500).send("Error creating user: " + error.message);
        }
    }
};

export const createRandomUserHandler = async (req, res) => {
    try {
        const result = await UserService.createRandomUser(req.params.qty);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send("Error creating users: " + error.message);
    }
};

export const getUsersHandler = async (req, res) => {
    try {
        const users = await UserService.findAllUsers();
        if (users.length === 0) {
            res.status(404).send("{No users found}");
        } else {
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).send("Error fetching users: " + error.message);
    }
};

export const getProductsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        let products;
        if (req.query.page && req.query.pageSize) {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            products = await ProductService.findAllProductsByUserIdPagintation(
                userId,
                page,
                pageSize
            );
        } else {
            products = await ProductService.findAllProductsByUserId(userId);
        }
        if (products.length === 0) {
            res.status(404).send("{No products found}");
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).send("Error fetching products: " + error.message);
    }
};

export const getFavoriteProductsHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        const favorites = await UserService.getFavoriteProducts(userId);

        if (favorites.length === 0) {
            res.status(404).send("No products found");
        } else {
            res.status(200).json(favorites);
        }
    } catch (error) {
        res.status(500).send(
            "Error fetching favorites products: " + error.message
        );
    }
};

export const linkedInAuth = async (req, res, next) => {
    try {
        const stringifiedParams = queryString.stringify({
            client_id: process.env.LINKEDIN_CLIENT_ID,
            redirect_uri: `${process.env.API_URL}${process.env.API_PREFIX}/users/auth/linkedin/callback`,
            scope: ["profile", "email", "openid"].join(" "),
            response_type: "code",
        });
        return res.redirect(
            `https://www.linkedin.com/oauth/v2/authorization?${stringifiedParams}`
        );
    } catch (error) {
        next(error);
    }
};

export const linkedInRedirect = async (req, res, next) => {
    try {
        const { code } = req.query;
        console.log("code: -----> ", code);
        console.log("TRY TO GET ACCESSTOKEN +++++");
        const tokenData = await axios({
            url: "https://www.linkedin.com/oauth/v2/accessToken",
            method: "post",
            data: {
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri: `${process.env.API_URL}${process.env.API_PREFIX}/users/auth/linkedin/callback`,
                grant_type: "authorization_code",
                code,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        console.log("tokenData: ", tokenData.data.access_token);
        const accessToken = tokenData.data.access_token;
        const userData = await axios({
            url: "https://api.linkedin.com/v2/userinfo",
            method: "get",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("userData: ", userData.data);

        const { given_name, family_name, picture, email } = userData.data;
        let user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("NO USER IN DATABASE: ", user);

            const hashPassword = await bcrypt.hash(
                faker.internet.password(),
                3
            );
            const newUser = await User.create({
                firstName: given_name,
                lastName: family_name,
                email,
                password: hashPassword,
                avatar: picture,
                isActivated: true,
                socialToken: accessToken,
            });
            user = newUser;
        } else {
            user.socialToken = accessToken;
            await user.save();
        }

        res.redirect(
            `${process.env.SUCCESS_URL}/3?userId=${user.userId}&info=${accessToken}`
        );
    } catch (error) {
        next(error);
    }
};
