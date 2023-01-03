const express = require("express");
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/form", (req, res) => {
  console.log(req.body); // logs the form data in the server console
  res.json({ message: "Form data received!" });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
