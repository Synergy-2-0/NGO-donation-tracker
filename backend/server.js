const express = require('express');
const app = express();
const port = 3000;
require("./db.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Setup routes
app.use("/api", require("./routes/Customer"));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});