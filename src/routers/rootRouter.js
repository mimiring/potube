import express from "express";
import { logout, postJoin, postLogin } from "../controllers/userController";
import { search, home } from "../controllers/videoController";

const rootRouter = express();

rootRouter.get("/", home);
rootRouter.route("/join").post(postJoin);
rootRouter.route("/login").post(postLogin);
rootRouter.route("/logout").post(logout);
rootRouter.get("/search", search);

export default rootRouter;
