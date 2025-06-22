import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks?projectId=${id}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchTasks();
  }, [id]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Failed to fetch project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  if (loading) return <div className="p-4 text-white">Loading project...</div>;
  if (!project) return <div className="p-4 text-red-400">Project not found.</div>;
  

  return (
    <>
      <div className="p-6 text-white">
      {/* Project Info */}
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-400 mb-4">{project.description}</p>

        {/* Members */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Members</h2>
          <ul className="list-disc list-inside text-sm text-gray-300">
            {project.members.map((member) => (
              <li key={member._id}>
                {member.name} ({member.email})
              </li>
            ))}
          </ul>
        </section>

        {/* Tasks Section */}
        <section className="mt-10">
          <div className='flex justify-start gap-4 items-center mb-4'>
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="mb-4 px-2 py-1 bg-blue-700 text-white rounded shadow text-sm"
            >
              + Add Task
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['todo', 'in-progress', 'done'].map((status) => (
              <div key={status} className="bg-slate-800 p-4 rounded shadow">
                <h3 className="text-lg font-semibold capitalize mb-3">
                  {status.replace('-', ' ')}
                </h3>

                {groupedTasks[status]?.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No tasks</p>
                ) : (
                  groupedTasks[status].map((task) => (
                    <div key={task._id} className="p-3 mb-3 rounded bg-slate-700">
                      <div className="font-semibold text-white">{task.title}</div>
                      <div className="text-sm text-gray-300">{task.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        🕒 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        👤 {task.assignedTo?.email || 'Unassigned'}
                      </div>
                      <div className="text-xs mt-1">
                        🔥 Priority:{' '}
                        <span
                          className={`font-bold ${
                            task.priority === 'high'
                              ? 'text-red-400'
                              : task.priority === 'medium'
                              ? 'text-yellow-400'
                              : 'text-green-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      {isTaskModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-gray-900 text-white p-6 rounded w-[90%] max-w-md space-y-4 shadow-lg border border-gray-700 relative">
            <h3 className="text-xl font-semibold">Create New Task</h3>

            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />

            <textarea
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />

            {/* Assigned To */}
            <div>
              <label className="block mb-1 text-sm text-gray-400">Assign To</label>
              <select
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              >
                <option value="">Select a member</option>
                {project.members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block mb-1 text-sm text-gray-400">Priority</label>
              <select
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block mb-1 text-sm text-gray-400">Due Date</label>
              <input
                type="date"
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>

            {/* Buttons */}
            <div className="w-full flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsTaskModalOpen(false);
                  setNewTask({
                    title: '',
                    description: '',
                    assignedTo: '',
                    priority: 'medium',
                    dueDate: '',
                  });
                }}
                className="px-4 py-2 border border-gray-500 rounded-md text-white hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await api.post('/tasks', {
                      ...newTask,
                      projectId: project._id,
                    });
                    setIsTaskModalOpen(false);
                    setNewTask({
                      title: '',
                      description: '',
                      assignedTo: '',
                      priority: 'medium',
                      dueDate: '',
                    });
                    const res = await api.get(`/tasks?projectId=${project._id}`);
                    setTasks(res.data);
                  } catch (err) {
                    console.error('Error creating task:', err);
                  }
                }}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

    </>
    
  );
};

export default ProjectDetails;