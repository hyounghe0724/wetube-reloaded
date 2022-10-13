import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

const handleOpne = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("DB Error", error); // mongoose send variable error to func
db.on("error", handleError); // happen many time
db.once("open", handleOpne); // happese  once
