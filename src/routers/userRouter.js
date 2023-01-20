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
  .all(pulicOnlyMiddleware)
  .get(startGithubLogin);
userRouter
  .route("/github/finish")
  .all(pulicOnlyMiddleware)
  .get(finishGithubLogin);
userRouter
  .route("/edit-profile")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
userRouter.route("/logout").all(protectorMiddleware).get(logout);

export default userRouter;
