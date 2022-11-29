import express from "express";
import { registerView, createComment, deleteComment } from "../controllers/videoControllers";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment)
apiRouter.delete("/videos/:id([0-9a-f]{24})/comment/delete/:commentId([0-9a-f]{24})",  deleteComment)

export default apiRouter;
 

// button click > comment id > front end , backend 에서 삭제