import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/auth.context';
import api from '../services/api';
import Loader from '../components/Loader';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: ''
  });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const memberIds = formData.members
        .split(',')
        .map((m) => m.trim())
        .filter((id) => id);

      await api.post('/projects', {
        name: formData.name,
        description: formData.description,
        members: memberIds
      });

      setShowModal(false);
      setFormData({ name: '', description: '', members: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Project
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[90%] max-w-md space-y-4">
            <h3 className="text-xl font-semibold">Create New Project</h3>
            <input
              className="w-full border p-2 rounded"
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Member IDs (comma-separated)"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">
                Cancel
              </button>
              <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div key={proj._id} className="p-4 border rounded shadow">
            <h4 className="font-bold">{proj.name}</h4>
            <p className="text-sm text-gray-600">{proj.description}</p>
            <p className="text-xs mt-2">Members: {proj.members?.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;