const Task = require('../models/task.model')


const createTask = async (data) => {
  let response
  const task = new Task(data)
  try {
    await task.save()
    response = {
      success: true,
      status: 200,
      extras: { message: 'Task created' }
    }
  } catch (e) {
    response = {
      success: false,
      status: 417,
      extras: {
        message: 'Cannot create a task',
        error: e
      }
    }
  }

  return (response)
}

const getAllTasks = async () => {
  let response
  await Task.find()
    .then(tasks => response = {
      success: true,
      status: 200,
      extras: {
        message: 'Getting all Tasks',
        tasks: tasks
      }
    })
    .catch(error => response = {
      success: false,
      status: 400,
      extras: { message: error }
    })

  return (response)
}

const updateTask = async (params) => {
  let name=params.name; 
  let isDone=params.isDone;
  let response
  try {
    let x = await Task.updateOne({ 
      name: name, 
    }, { 
      $set: { 
        isDone: isDone, 
      }, 
    })
    response = {
      success: true,
      status: 200,
      extras: { message: 'Task updated' }
    }
    console.log(x);
  } catch (e) {
    response = {
      success: false,
      status: 417,
      extras: {
        message: 'Cannot update task',
        error: e
      }
    }
  }

  return (response)
}

const deleteTask = async (name) => {
  console.log(name);
  let response
  try {
    let x = await Task.deleteOne({ name: name })
    response = {
      success: true,
      status: 200,
      extras: { message: 'Task deleted' }
    }
    console.log(x);
  } catch (e) {
    response = {
      success: false,
      status: 417,
      extras: {
        message: 'Cannot delete a task',
        error: e
      }
    }
  }

  return (response)
}

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
}