import express from "express";
import {
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  putEditProfile,
  putEditPassword,
} from "../controllers/userController";
import { protectorMiddleware, uploadFiles } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/github/start").get(startGithubLogin);
userRouter.route("/github/finish").get(finishGithubLogin);
userRouter
  .route("/:id")
  .all(protectorMiddleware)
  .get(see)
  .put(uploadFiles.single("avatar"), putEditProfile)
  .delete(remove);
userRouter
  .route("/:id/editPassword")
  .all(protectorMiddleware)
  .put(putEditPassword);

export default userRouter;
