import User from "../models/Users/User.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import mailService from "./MailService.js";
import tokenService from "./TokenService.js";
import UserDto from "../dtos/UserDto.js";
import ApiError from "../exceptions/ApiError.js";
import ProfileDto from "../dtos/ProfileDto.js";
import Author from "../models/Users/Author.js";
import Member from "../models/Member/Member.js";
import MemberRoles from "../models/Member/MemberRoles.js";

const registration = async (email, password) => {
    console.log("<<< CHECK USER >>>");
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
        throw ApiError.Conflict(`User with this email ${email} exists`);
    }
    console.log("<<< CHECK USER PASS >>>");

    console.log("<<< INSERT user START >>>");
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = faker.string.uuid();
    const user = await User.create({
        email: email,
        password: hashPassword,
        activationLink: activationLink,
    });
    console.log("<<< INSERT user END >>>");

    await mailService.sendActivationMail(
        email,
        `${process.env.API_URL}${process.env.API_PREFIX}/users/activate/${activationLink}`
    );

    return user;
};

const activate = async (activationLink) => {
    const user = await User.findOne({ where: { activationLink } });
    if (!user) {
        throw ApiError.BadRequest("Incorrect activation link");
    }
    user.isActivated = true;
    const socialToken = faker.string.uuid();
    user.socialToken = socialToken;
    await user.save();

    return { userId: user.userId, socialToken };

    // const userDto = new UserDto(user); // id, email, username, role, isActivated
    // console.log("userDto->>>> ", userDto);
    // const tokens = tokenService.generateTokens({ ...userDto });
    // await tokenService.saveToken(userDto.id, tokens.refreshToken);

    // return { ...tokens, user: userDto };
};

const sendRestoreNumber = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw ApiError.NotFound("User with this email not found");
    }
    const restorePassNumber = faker.string.numeric(6);

    user.restoreNumber = restorePassNumber;
    await user.save();

    await mailService.sendRestoreMail(email, restorePassNumber);
};

const changePassword = async (restoreNumber, password, confirmPassword) => {
    const user = await User.findOne({ where: { restoreNumber } });
    if (!user) {
        throw ApiError.NotFound("Incorrect restore number");
    }
    if (password !== confirmPassword) {
        throw ApiError.BadRequest("Password and confirm password do not match");
    }
    user.password = await bcrypt.hash(password, 3);
    user.restoreNumber = null;
    await user.save();

    return new UserDto(user);
};

const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw ApiError.NotFound("User with this email not found");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
        throw ApiError.NotFound("Incorrect password");
    }
    if (!user.isActivated) {
        throw ApiError.NotFound("The user is not activated yet");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
};

const loginSocial = async (userId, info) => {
    console.log("userId in loginSocial-->: ", userId);
    console.log("info in loginSocial-->: ", info);
    const user = await User.findByPk(userId);
    console.log("user in loginSocial: ", user);
    if (!user) {
        throw ApiError.NotFound("User not found");
    }
    if (user.socialToken != info) {
        throw ApiError.NotFound("User not found");
    }
    user.socialToken = "";
    await user.save();

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
};

const logout = async (refreshToken) => {
    const token = await tokenService.removeToken(refreshToken);
    return token;
};

const refresh = async (refreshToken) => {
    if (!refreshToken) {
        throw ApiError.UnautorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
        throw ApiError.UnautorizedError();
    }
    const user = await User.findByPk(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
};

/* request fields:
    firstName,
    lastName,
    phone,
    messengers: [<messenger's ids>]
    authorDescription,
    memberDescription,
    memberRoles: [
        {
            memberRoleId: integer,
            experience: string
            skills: [skill's ids]
        },
        {
            memberRoleId: interger,
            experience: string
            skills: [skill's ids]
        }
    ]
   
*/
const changeProfile = async (userId, profileData) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw ApiError.NotFound("User not found");
    }
    console.log("Request profile data ->>>>> ", profileData);
    const {
        firstName,
        lastName,
        phone,
        messengers,
        authorDescription,
        memberDescription,
        memberRoles,
    } = profileData;
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    if (phone) {
        user.phone = phone;
    }
    // update messengers
    if (messengers) {
        console.log("messengers ->>> ", messengers);
        messengers.map((messengerId) => {
            console.log(messengerId);
            user.addMessenger(messengerId);
        });
    }
    // update author
    if (authorDescription) {
        const author = await Author.findOne({ where: { userId } });
        if (author) {
            author.description = authorDescription;
        } else {
            author = await user.createAuthor({
                description: authorDescription,
            });
        }
    }
    // update member
    const member = await Member.findOne({ where: { userId } });
    if (!member) {
        member = await user.createMember({
            description: null,
        });
    }
    if (memberDescription) {
        member.description = memberDescription;
    }
    if (memberRoles) {
        memberRoles.map((roleId) => {
            member.addRole(roleId);
        });
    }
    member.save();

    // if (memberRoles) {
    //     memberRoles.map(async (item) => {
    //         const memberRole = await MemberRoles(item.memberRoleId);
    //         if (!memberRole) {
    //             memberRole = member.addRole(item.memberRoleId);
    //         }
    //     });
    // }

    user.save();

    return new ProfileDto(user);
};

const getProfile = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw ApiError.NotFound("User not found");
    }
    const profileDto = new ProfileDto(user);

    const userMessengers = await user.getMessengers({
        attributes: ["MessengerId", "name"],
        raw: true,
    });
    const simplifiedMessengers = userMessengers.map((messenger) => ({
        MessengerId: messenger.MessengerId,
        name: messenger.name,
    }));
    const author = await Author.findOne({ where: { userId } });
    const member = await Member.findOne({ where: { userId } });
    const roles = member.getRoles();
    // console.log("userMessengers =>>> ", simplifiedMessengers);
    const responseUser = {
        ...profileDto,
        messengers: simplifiedMessengers,
        authorDescription: author.description,
        memberDescription: member.description,
        roles: roles,
    };
    return { user: responseUser };
};

const addAuthor = async (userId, description) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw ApiError.NotFound("User not found");
    }

    const author = await user.createAuthor({
        description,
    });
    return author;
};

const getAuthor = async (userId) => {
    const author = await Author.findOne({ where: { userId } });
    if (!author) {
        throw ApiError.NotFound("Author not found");
    }

    return author;
};

const addMember = async (userId, description) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw ApiError.NotFound("User not found");
    }

    const member = await user.createMember({
        description,
    });
    return member;
};

const getMember = async (userId) => {
    const member = await Member.findOne({ where: { userId } });
    if (!member) {
        throw ApiError.NotFound("Member not found");
    }

    return member;
};

const findAllUsers = async () => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        throw error;
    }
};

const findUserById = async (id) => {
    try {
        const user = await User.findByPk(id);
        return user;
    } catch (error) {
        throw error;
    }
};

export default {
    findAllUsers,
    registration,
    activate,
    login,
    logout,
    refresh,
    findUserById,
    sendRestoreNumber,
    changePassword,
    changeProfile,
    getProfile,
    addAuthor,
    getAuthor,
    addMember,
    getMember,
    loginSocial,
};
