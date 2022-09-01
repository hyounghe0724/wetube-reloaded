import express from "express";
import logger from "morgan";
//listen function in callback func is  operate at server stared  
//port is like computer's window

const PORT = 5000;

const app = express();
const logger = morgan("dev");

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