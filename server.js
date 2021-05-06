const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.json(user);
  } catch (err) {
    return res.status(400).send();
  }
});

app.post("/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) return res.status(400).send("not found...");
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Failed");
    }
  } catch (err) {
    res.status(400).send("err");
  }
});

app.listen(3000, () => console.log(`App is listening...`));
