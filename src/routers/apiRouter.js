import express from "express";
import { registerView, createComment, deleteComment } from "../controllers/videoControllers";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment)
apiRouter.post("/comment/delete",  deleteComment)

export default apiRouter;
 