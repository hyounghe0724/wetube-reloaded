import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/video";
import "./models/User";
import "./models/Comment"
import app from "./server";

const PORT = process.env.PORT || 57621;

const handleListening = () => {
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`); // 외부 접속을 받고 callback 함수  실행
};
app.listen(PORT, handleListening);
