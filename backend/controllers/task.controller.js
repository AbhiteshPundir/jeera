import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksByProject = async (req, res) => {
  const { projectId } = req.query;

  try {
    const tasks = await Task.find({ projectId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};