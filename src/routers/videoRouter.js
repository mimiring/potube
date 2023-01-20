import express from "express";
import {
  deleteVideo,
  getEdit,
  watch,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(postUpload);
videoRouter.all(protectorMiddleware).get("/:id([0-9a-f]{24})", watch);
videoRouter
  .all(protectorMiddleware)
  .get("/:id([0-9a-f]{24})/delete", deleteVideo);
videoRouter
  .all(protectorMiddleware)
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEdit)
  .post(postEdit);

export default videoRouter;
