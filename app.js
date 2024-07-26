import "./config.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swaggerConfig.js";

import router from "./routes/index.js";
import "./models/models.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import passport from "./config/passportConfig.js";

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorMiddleware);

const start = async () => {
    try {
        app.listen(process.env.SERVER_PORT, () =>
            console.log(`server was started on port ${process.env.SERVER_PORT}`)
        );
    } catch (e) {
        console.log(e);
    }
};
console.log("Trying to start server...");
start();
