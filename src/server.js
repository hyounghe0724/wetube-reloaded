import express from "express";
<<<<<<< HEAD
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleWare } from "./middleware";
//listen function in callback func is  operate at server stared
//port is like computer's window

const PORT = 57621;
=======
import logger from "morgan";
//listen function in callback func is  operate at server stared  
//port is like computer's window

const PORT = 5000;
>>>>>>> c3a1690c5c4664e403de60bf44377b15122abd96

const app = express();
const logger = morgan("dev");

<<<<<<< HEAD
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true })); //req.body parsing

// ----세션----
// 브라우저 요청 > 백엔드 > 백엔드 에서 유저의 id를 요청에담아 보냄(쿠키)과 동시에
// 세션 DB에 저장 > 유저는 그 id를 브라우저의 쿠키에 저장
// 그후 다시 방문할때 세션 DB와 브라우저의 쿠키의 id를 서로 비교하여 일치하도록 함
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// required name attr in input and this located middleware
app.use(localsMiddleWare);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
//app.use() to specify middleware as the callback function (See Using middleware for details)

export default app;
=======
const home = (req, res) => {
  console.log("I will respond.")
  return res.send("hello");
};
const login = (req, res) => {
  return res.send("login");
};
app.use(logger("dev"))
app.get("/", home);
app.get("/login", login);

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`); // 외부 접속을 받고 callback 함수  실행
  
app.listen(PORT, handleListening);
>>>>>>> c3a1690c5c4664e403de60bf44377b15122abd96
