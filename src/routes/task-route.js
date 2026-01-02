import { todoModel } from "../db-model/todo-model.js";
import { userModel } from "../db-model/user-model.js";
import { v4 as idGene } from "uuid";

const createTask = async (req, res) => {
  try {
    // Body: title(rq), description(rq), status(rq)
    const payload = req.user;
    const body = req.body;
    if (!body.title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!body.description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const isStatusValid = ["pending", "in-progress", "done"].some(
      (status) => body.status === status
    );

    if (!isStatusValid) {
      return res.status(400).json({ message: "Correct Status is required" });
    }

    // const user = await userModel.findOne({ email: payload.email });
    console.log("payload.userId", payload.userId);
    const taskId = idGene();
    const taskPayload = {
      title: body.title,
      description: body.description,
      status: body.status,
      userId: payload.userId,
      taskId: taskId,
    };
    const todo = await todoModel.create(taskPayload);
    res.status(201).json(todo);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

const fetchTasks = async (req, res) => {
  try {
    const payload = req.user;
    const todos = await todoModel.find({ userId: payload.userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    // GOAL: Update title for a particular task

    // Body: newTitle(required), which particular task(taskId - required)
    // Update title in db using taskId
    //    Find task using taskId
    //    Update the particular task's title value with newTitle
    // Send updated task as response

    const body = req.body;

    // if (!body) {
    //   return res.status(400).json({ error: "Body is required" });
    // }
    if (!body.title) {
      return res.status(400).json({ error: "Title is required" });
    }
    // if (!body.taskId) {
    //   ("throw error taskId required");
    // }

    // const taskId = body.taskId;
    const taskId = req.params.id;
    
    // // To update document in mongoDb: Way 1
    // const updatePayload = {
      //   title: newTitle,
      // };
      
      // const updatedTodo = await todoModel.findOneAndUpdate(
        //   { taskId: taskId },
        //   updatePayload,
        //   { new: true }
        // );
        
        // if (!updatedTodo) {
          //   return res.status(404).json({ error: "Task not found" });
          // }
          
          // To update document in mongoDb: Way 2
          const foundTask = await todoModel.findOne({ taskId: taskId });
          
          if (!foundTask) {
            return res.status(404).json({ error: "Task not found" });
          }
          const newTitle = body.title;
    foundTask.title = newTitle;
    // foundTask.status = "new status";

    await foundTask.save();

    // Final api response
    res.status(200).json(foundTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {

    // GOAL: Delete a particular task

    // Body: taskId(required)
    // Find task using taskId if exists or not
    // if taskId match found then Delete task documents in db using taskId
    // Delete the particular task
    // Send success message as response
    
    // const payload = req.user;
    // const body = req.body;
    // const todo = await todoModel.findById(userId);
    // if (!todo) {
      //   return res.status(404).json({ error: "Task not found" });
      // }
      
      // if (userId !== payload.userId) { return res.status(403).json({ error: "Unauthorized to delete this task",});}
      
      const taskId = req.params.id;
      if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
      }
    const deletedTodo = await todoModel.findOneAndDelete({
      taskId: taskId,
    });

    if (!deletedTodo) {
      return res.status(404).json({ error: "task already deleted" });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const body= req.body;
    const userId= body.userId;
    const name= body.name;

    let user = await userModel.findOne({ userId });

    if (!user) {
      user = await userModel.create({ name });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export { createTask, fetchTasks, updateTask, deleteTask };

// // GET all todos
// taskRouter.get("", authenticate, fetchTasks);

// // UPDATE todo
// taskRouter.put("/:id", authenticate, updateTask);

// // DELETE todo
// taskRouter.delete("/userId", authenticate, deleteTask);
// // ---------------- USER API ----------------

// taskRouter.post("/user", getUser);

// taskRouter.post("", authenticate, createTask);

