import express from "express";
import {
  remove,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
  postEdit,
  getEdit,
} from "../controllers/userController";
import { protectorMiddleware, pulicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/github/start")
  .get(startGithubLogin)
  .all(pulicOnlyMiddleware, protectorMiddleware);
userRouter
  .route("/github/finish")
  .get(finishGithubLogin)
  .all(pulicOnlyMiddleware, protectorMiddleware);
userRouter
  .route("/edit-profile")
  .get(getEdit)
  .post(postEdit)
  .all(protectorMiddleware);
userRouter.route("/logout").get(logout);

export default userRouter;
