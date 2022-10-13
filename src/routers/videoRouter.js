import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoControllers";
const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);
//what :id mean?, what req.params
//: < use variable into URL's parameter , id in :id is parameter name
// req.params is value of  parameter in URL(type is Doct)
// ex req.params => { id : "#"}
// this opertion is express
export default videoRouter;
