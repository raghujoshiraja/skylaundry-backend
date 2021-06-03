const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT || 4040;
const MONGO_CONN_STRING = process.env.MONGO_CONN_STRING;

app = express();
app.use(express.json());

var corsOptions = {
  origin: ["http://localhost:3000", "https://skylaundryp7.netlify.app"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

mongoose.connect(MONGO_CONN_STRING, {
  // Configs to prevent warnings. IDK what they do
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.once("open", () => console.log("MongoDB Connected!"));

// Routers for applications
app.use("/users", require("./routes/userRouter"));
app.use("/categories", require("./routes/categoryRouter"));
app.use("/orders", require("./routes/orderRouter"));

// Hello world test message
app.get("/", (req, res) =>
  res.json({
    message: "Hey! The backend is working. Explore routes from the code",
  })
);
// Ping
app.get('/ping', (req, res) => res.status(200).json({message: "pong"}))

app.listen(PORT, () => console.info(`Started listening on PORT ${PORT}`));
