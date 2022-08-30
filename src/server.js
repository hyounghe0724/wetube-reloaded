import express from "express"
//listen function in callback func is  operate at server stared  
//port is like computer's window
const PROT = 4000;
const app = express();

const handleHome = (req, res) => {
    return res.send("<h1>I still love you</h1>");

}

app.get("/", handleHome);

const handleListening = () => console.log(`Server listening on port http://localhost:${PROT}`);
app.listen(PROT, handleListening) // 외부 접속을 받고 callback 함수  실행

