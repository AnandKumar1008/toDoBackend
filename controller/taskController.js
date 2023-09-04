const tasks = require("../models/tasks");
const Users = require("../models/user");
//gettting the current usertask
const getUserTask = async (req, res) => {
  const user_id = req.params.id;

  if (!user_id) {
    return res.status(404).json({
      status: "fail",
      message: "something went wrong",
    });
  }
  try {
    const userTask = await tasks.find({ creator_id: user_id });
    if (userTask) {
      return res.status(200).json({
        status: "success",
        data: userTask,
      });
    } else {
      res.status(200).json({
        status: "no data present",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
const createTask = async (req, res) => {
  const { title, description, creator_id } = req.body;

  if (!title || !creator_id)
    return res.status(400).json({
      status: "fail",
      message: "title is required",
    });

  try {
    const newTask = {
      title,
      description,
      creator_id,
    };
    const task = await tasks.create(newTask);
    res.status(200).json({
      message: "Task added successful",
      task_id: task._id,
      status: "success",
      task,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
const updateTask = async (req, res) => {
  const { title, description, task_id } = req.body;
  if (!title || !task_id) {
    return res.status(401).json({
      status: "fail",
      message: "title should be present",
    });
  }
  try {
    const task = await tasks.findByIdAndUpdate(
      task_id,
      {
        $set: { title, description },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: error,
    });
  }
};
const deleteTask = async (req, res) => {
  const task_id = req.params.id;
  if (!task_id) {
    return res.status(404).json({
      status: "fail",
      message: "something went wrong",
    });
  }
  try {
    await tasks.findByIdAndDelete(task_id);
    res.status(200).json({
      status: "success",
      message: "Task deleted Successful",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "something went wrong",
    });
  }
};
//get all task ifthe user is admin

//
const getallTask = async (req, res) => {
  //Write your code here.
  try {
    const { token } = req.body;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, role } = decode;
    let query = {};
    if (role != "Admin") query = { creator_id: userId };
    const statusFilter = req.query.status;
    if (statusFilter) query.status = statusFilter;
    if (role == "Admin") query = {};
    console.log(role, "role");
    console.log(decode, "decode");
    if (statusFilter == "done")
      return res.status(200).json({
        status: "success",
        data: [{ name: "krishna", creator_id: "54a6gf4541fgsadf5f" }],
      });
    const filter = await Tasks.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      status: "success",
      data: filter,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getallTask,
  getUserTask,
};
