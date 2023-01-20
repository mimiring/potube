import express from "express";
import {
  remove,
  edit,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import { protectorMiddleware, pulicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/github/start")
  .all(pulicOnlyMiddleware, protectorMiddleware)
  .get(startGithubLogin);
userRouter
  .route("/github/finish")
  .all(pulicOnlyMiddleware, protectorMiddleware)
  .get(finishGithubLogin);
userRouter.route("/:id").get(see).put(putEditProfile).delete(remove);
userRouter.route("/edit").all(protectorMiddleware).put(putEditProfile);

export default userRouter;
