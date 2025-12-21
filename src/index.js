// index.js for Express server

// 1. Import modules and models
import express from "express";
import cors from "cors";
import { connectDb } from "./database/db-connect.js";
import { carModel } from "./db-model/car-model.js";
import { todoModel } from "./db-model/todo-model.js";
import { userModel } from "./db-model/user-model.js";

const app = express();
// 2. Middleware setup

//    CORS
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

/*    body parser */
app.use(express.json());


// ---------------- CAR API ----------------
app.post("/create", async (req, res) => {
  const body = req.body;
  console.log("Body: ", body);

  if (!body.speed) {
    return res.status(400).send("Speed is required");
  }

  const crestedCar = await carModel.create(body);
  res.send(crestedCar);
});

app.get("/create", async (req, res) => {
  const crestedCar = await carModel.find();
  res.send(crestedCar);
});


// ---------------- LOGIN API ----------------
app.post("/login", async (req, res) => {
  res.send({ isUserLoggedIn: false });
});


// ---------------- TODO CRUD APIs ----------------

// CREATE todo
app.post("/taskcreate", async (req, res) => {
  try {
    const todo = await todoModel.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all todos
app.get("/tasks/:userId", async (req, res) => {
  try {
    const todos = await todoModel.find( { userId: req.params.userId } );
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE todo
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE todo
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTodo = await todoModel.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
  // ---------------- USER API ----------------

app.post("/user", async (req, res) => {
  try {
    const { name } = req.body;

    let user = await userModel.findOne({ name });

    if (!user) {
      user = await userModel.create({ name });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// ---------------- DB + SERVER ----------------
await connectDb();

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
