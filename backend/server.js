const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

// import routes
const authRoutes = require("./routes/auth");
const app = express();

// connect to database
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("database connected"))
  .catch(err => console.log("db error"));

//app middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors())    all origin
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: `http://localhost:3000`
    })
  );
}

// routes middlewares
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Api is running on port ${port}`);
});
