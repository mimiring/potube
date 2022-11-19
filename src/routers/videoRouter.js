import express from "express";
import {
  deleteVideo,
  getEdit,
  watch,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);

export default videoRouter;
