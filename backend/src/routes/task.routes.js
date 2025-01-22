const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/task.controller');
const router = express.Router();
console.log("task route called");

router.route("/createTask").post(createTask);
router.route("/tasks").get(getTasks);
router.route("/getTaskById/:id").get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;