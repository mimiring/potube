import express from "express";
import { getJoin, postJoin, login } from "../controllers/userController";
import { search, home } from "../controllers/videoController";

const rootRouter = express();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

export default rootRouter;
