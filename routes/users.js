import express from "express";
import {
    getUsersHandler,
    getSingleUserHandler,
    createUserHandler,
    createRandomUserHandler,
    getProductsByUserId,
    getFavoriteProductsHandler,
    registrationHandler,
    loginHandler,
    logoutHandler,
    activateHandler,
    refreshHandler,
    sendRestoreNumberHandler,
    changePasswordHandler,
    changeProfileHandler,
    getProfileHandler,
    loginSocialHandler,
    linkedInAuth,
    linkedInRedirect,
    // addAuthorHandler,
    // getAuthorHandler,
    // addMemberHandler,
    // getMemberHandler,
} from "../controllers/users.js";
import { userSingUpSchema } from "../schemas/usersSchema.js";
import {
    authenticate,
    authGoogle,
    authGoogleCallback,
} from "../middlewares/auth-middleware.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

// Registration, Login, Logout, Activation, Refresh

router.post("/register", validateBody(userSingUpSchema), registrationHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.post("/restore", sendRestoreNumberHandler);
router.post("/changepassword", changePasswordHandler);
router.get("/activate/:link", activateHandler);
router.get("/refresh", refreshHandler);

router.get("/auth/google", authGoogle);
router.get("/auth/google/callback", authGoogleCallback);

router.get("/auth/linkedin", linkedInAuth);
router.get("/auth/linkedin/callback", linkedInRedirect);

router.post("/loginFromSocial", loginSocialHandler);

router.put("/:userId/profile", changeProfileHandler);
router.get("/:userId/profile", getProfileHandler);

// router.post("/:userId/author", addAuthorHandler);
// router.get("/:userId/author", getAuthorHandler);

// router.post("/:userId/member", addMemberHandler);
// router.get("/:userId/member", getMemberHandler);

// router.get('/:userId/favorite', getFavoriteProductsHandler);
// router.get('/:userId/products', authMiddleware, getProductsByUserId);
// router.get('/:userId', authMiddleware, getSingleUserHandler);
// router.get('/', authMiddleware, getUsersHandler);
// router.post('/', createUserHandler);
// router.post('/create/random/:qty', createRandomUserHandler);

export default router;
