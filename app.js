require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// routes
app.use("/api/trips", require("./routes/trips.route"));

app.get("/", (_, res) => {
  res.send("We are on home");
});

app.get("/healthz", (_, res) => {
  res.status(200).send("Ok");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
