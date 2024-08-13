const express = require("express");
const { connectToDB } = require("./config/db");
const config = require("./config/config.json");
const userRoutes = require("./routes/user.routes");
const bmrFormRoutes = require("./routes/bmr_form.routes");
const bmrRecords = require('./routes/bmr_records.routes');
const http = require("http");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "documents")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use('/user', userRoutes);
app.use('/bmr-form', bmrFormRoutes);
app.use('/bmr-record', bmrRecords);

server.listen(config.development.PORT, "0.0.0.0", async () => {
  connectToDB()
    .then(() => {
      console.log("Server is running at port: " + config.development.PORT);
    })
    .catch((e) => {
      console.log("Error in database connection", e);
    });
});
