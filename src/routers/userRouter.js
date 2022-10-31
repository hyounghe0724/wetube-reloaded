import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  startKakaoLogin,
  finishKakaoLogin,
  getChangePassworod,
  postChangePassworod,
  expireFnc
} from "../controllers/userControllers";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  uploadAvatar,
} from "../middleware";
const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadAvatar.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassworod)
  .post(postChangePassworod);
userRouter.get("/expire", protectorMiddleware, expireFnc)
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);
userRouter.get("/:id", see);
//users/kakao/start
export default userRouter;
