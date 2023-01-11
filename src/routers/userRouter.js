import express from "express";
import {
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  putEditProfile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/editProfile").put(putEditProfile);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
