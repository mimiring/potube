import express from "express";
import {
  logout,
  startGithubLogin,
  finishGithubLogin,
  postEdit,
  getEdit,
  getChangePassword,
  postChangePassword,
  userPage,
} from "../controllers/userController";
import {
  protectorMiddleware,
  pulicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

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
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.route("/:id").get(userPage);
userRouter.route("/logout").all(protectorMiddleware).get(logout);

export default userRouter;
