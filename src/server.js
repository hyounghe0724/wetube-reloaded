import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
//listen function in callback func is  operate at server stared  
//port is like computer's window

const PORT = 57621


const app = express();
const logger = morgan("dev");

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views" )
app.use(logger)
app.use(express.urlencoded({ extended: true})) // required name attr in input and this located middleware
app.use("/", globalRouter);
app.use("/videos", videoRouter)
app.use("/users", userRouter)


export default app

