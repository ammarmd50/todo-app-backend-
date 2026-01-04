// index.js for Express server
// 1. Import modules and models
import express from "express";
import cors from "cors";
import { connectDb } from "./database/db-connect.js";
// import { carModel } from "./db-model/car-model.js";
//import { todoModel } from "./db-model/todo-model.js";
//import { userModel } from "./db-model/user-model.js";
import authRouter from "./routes/auth.route.js";
import taskRouter from "./routes/taskRouter.js";
import cookieParser from "cookie-parser";

const app = express();
// 2. Middleware setup

//    CORS
app.use(express.json());
app.use(
  cors({
    origin: true, // ✅ allow all origins safely
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());

// 3. Route setup
/*    body parser */
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

// // ---------------- CAR API ----------------
// app.post("/create", async (req, res) => {
//   const body = req.body;
//   console.log("Body: ", body);

//   if (!body.speed) {
//     return res.status(400).send("Speed is required");
//   }

//   const crestedCar = await carModel.create(body);
//   res.send(crestedCar);
// });

// app.get("/create", async (req, res) => {
//   const crestedCar = await carModel.find();
//   res.send(crestedCar);
// });

// ---------------- LOGIN API ----------------
// app.post("/login", async (req, res) => {
//   res.send({ isUserLoggedIn: false });
// });

// ---------------- TODO CRUD APIs ----------------

// CREATE todo
// app.post("/taskcreate", async (req, res) => {
//   try {
//     const todo = await todoModel.create(req.body);
//     res.status(201).json(todo);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// ---------------- DB + SERVER ----------------
await connectDb();

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
