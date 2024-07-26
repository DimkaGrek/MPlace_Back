import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import jwt from "jsonwebtoken";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL}/api/v1/users/auth/google/callback`,
        },
        (accessToken, refreshToken, profile, done) => {
            // Логіка обробки користувача або створення JWT
            // console.log("accessToken: ", accessToken);
            // console.log("profile: ", profile);

            // const userToken = jwt.sign(profile.toJSON(), "YOUR_SECRET_KEY");
            done(null, profile, accessToken); // Повертаємо JWT токен замість користувача
        }
    )
);

// passport.use(
//     new LinkedInStrategy(
//         {
//             clientID: process.env.LINKEDIN_CLIENT_ID,
//             clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//             callbackURL:
//                 "http://localhost:5050/api/v1/users/auth/linkedin/callback",
//             scope: ["email"],
//         },
//         (accessToken, refreshToken, profile, done) => {
//             // Логіка обробки користувача або створення JWT
//             console.log("accessToken: ", accessToken);
//             console.log("profile: ", profile);

//             // const userToken = jwt.sign(profile.toJSON(), "YOUR_SECRET_KEY");
//             done(null, profile, accessToken); // Повертаємо JWT токен замість користувача
//         }
//     )
// );

export default passport;
