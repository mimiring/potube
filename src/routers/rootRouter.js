import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from "../controllers/userController";
import { search, home } from "../controllers/videoController";

const rootRouter = express();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/logout").get(logout);
rootRouter.get("/search", search);

export default rootRouter;
