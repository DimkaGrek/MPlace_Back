import { faker } from "@faker-js/faker/locale/af_ZA";
import ApiError from "../exceptions/ApiError.js";
import User from "../models/Users/User.js";
import tokenService from "../services/TokenService.js";
import passport from "passport";
import bcrypt from "bcrypt";

export const authenticate = (req, res, next) => {
    try {
        console.log(req.headers);
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnautorizedError());
        }
        console.log(authorizationHeader);
        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.UnautorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnautorizedError());
        }

        req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnautorizedError());
    }
};

// Ініціює аутентифікацію через Google і визначає scope необхідних даних
export const authGoogle = passport.authenticate("google", {
    scope: ["profile", "email"],
});

export const authGoogleCallback = (req, res, next) => {
    passport.authenticate("google", async (err, profile, info) => {
        if (err) {
            return next(err);
        }
        if (!profile) {
            throw ApiError.NotFound("No user");
        }
        let user = await User.findOne({
            where: { email: profile._json.email },
        }); // check if user exist in database
        if (!user) {
            console.log("NO USER IN DATABASE: ", user);
            const { given_name, family_name, picture, email } = profile._json;
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
                socialToken: info,
            });
            user = newUser;
        } else {
            user.socialToken = info;
            await user.save();
        }
        // console.log("req in authGoogleCallback: ", req.user);
        console.log("profile: ", profile);
        console.log("info: ", info);
        console.log("email: ", profile._json.email);
        console.log("user: ", user);

        // Тут можна зберегти JWT в cookie або зробити редирект з токеном
        // Наприклад, збереження токену в cookie:
        // res.cookie('jwt', user, { httpOnly: true, secure: true });
        // Або редирект з токеном в URL:
        res.redirect(
            `${process.env.SUCCESS_URL}/3?userId=${user.userId}&info=${info}`
        );
    })(req, res, next);
};

// Ініціює аутентифікацію через LinkedIn і визначає scope необхідних даних
// export const authLinkedIn = passport.authenticate("linkedin", {
//     scope: ["email"],
// });

// export const authLinkedInCallback = (req, res, next) => {
//     passport.authenticate("linkedin", async (err, profile, info) => {
//         if (err) {
//             return next(err);
//         }
//         if (!profile) {
//             throw ApiError.NotFound("No user");
//         }
//         let user = await User.findOne({
//             where: { email: profile._json.email },
//         }); // check if user exist in database
//         if (!user) {
//             console.log("NO USER IN DATABASE: ", user);
//             const { given_name, family_name, picture, email } = profile._json;
//             const hashPassword = await bcrypt.hash(
//                 faker.internet.password(),
//                 3
//             );
//             const newUser = await User.create({
//                 firstName: given_name,
//                 lastName: family_name,
//                 email,
//                 password: hashPassword,
//                 avatar: picture,
//                 isActivated: true,
//                 socialToken: info,
//             });
//             user = newUser;
//         } else {
//             user.socialToken = info;
//             await user.save();
//         }
//         // console.log("req in authGoogleCallback: ", req.user);
//         console.log("profile: ", profile);
//         console.log("info: ", info);
//         console.log("email: ", profile._json.email);
//         console.log("user: ", user);

//         // Тут можна зберегти JWT в cookie або зробити редирект з токеном
//         // Наприклад, збереження токену в cookie:
//         // res.cookie('jwt', user, { httpOnly: true, secure: true });
//         // Або редирект з токеном в URL:
//         res.redirect(
//             `${process.env.SUCCESS_URL}/3?userId=${user.userId}&info=${info}`
//         );
//     })(req, res, next);
// };
