const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
  getallTask,
  getUserTask,
} = require("../controller/taskController");
const router = express.Router();
router.post("/create", createTask);
router.patch("/update", updateTask);
router.delete("/delete/:id", deleteTask);
router.get("/alldata", getallTask);
router.get("/userTask/:id", getUserTask);
module.exports = router;
