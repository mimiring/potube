import express from "express";
import {
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  putEditProfile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/github/start").get(startGithubLogin);
userRouter.route("/github/finish").get(finishGithubLogin);
userRouter.route("/:id").get(see).put(putEditProfile).delete(remove);

export default userRouter;
