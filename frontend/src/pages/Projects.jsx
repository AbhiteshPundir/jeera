import { useEffect, useState } from 'react';
import api from '../services/api';
import Select from 'react-select';
import { useAuth } from '../context/auth.context';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/all');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

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

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const userOptions = users
  .filter(u => u._id !== user._id)
  .map(user => ({
    value: user._id,
    label: `${user.name}`
  }));

  const handleCreateProject = async () => {
    try {
      await api.post('/projects', {
        name: formData.name,
        description: formData.description,
        members: Array.from(selectedUserIds)
      });

      setShowModal(false);
      setFormData({ name: '', description: '' });
      setSelectedUserIds(new Set());
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-gray-900 text-white p-6 rounded w-[90%] max-w-md space-y-4 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold">Create New Project</h3>
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded"
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <textarea
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-400">Select Members</label>
              <Select
                options={userOptions}
                isMulti
                value={userOptions.filter(option => selectedUserIds.has(option.value))}
                onChange={(selected) => {
                  const selectedIds = new Set(selected.map(opt => opt.value));
                  setSelectedUserIds(selectedIds);
                }}
                styles={{
                  container: (base) => ({
                    ...base,
                    backgroundColor: '#1e293b', // outer container bg
                  }),
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: 'white',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#1e293b', // dropdown bg
                    borderRadius: 0,
                    marginTop: 0,
                  }),
                  menuList: (base) => ({
                    ...base,
                    backgroundColor: '#1e293b', // dropdown inner list bg
                    padding: 0,
                  }), 
                  input: (base) => ({ ...base, color: 'white' }),
                  singleValue: (base) => ({ ...base, color: 'white' }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#334155',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: 'white',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: 'white',
                    ':hover': {
                      backgroundColor: '#475569',
                      color: 'white',
                    }
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#334155' : '#1e293b',
                    color: 'white',
                    fontSize: '0.875rem'
                  }),
                }}
              />
            </div>


            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ name: '', description: '' });
                  setSelectedUserIds(new Set());
                }}
                className="px-4 py-2 border border-gray-500 rounded-md text-white hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Project List */}
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">No projects found. Create your first project!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="p-4 border rounded shadow bg-gray-800">
              <Link to={`/projects/${project._id}`}>
                <h4 className="font-bold">{project.name}</h4>
                <p className="text-sm text-gray-300">{project.description}</p>
                <p className="text-xs mt-2 text-gray-400">Members: {project.members?.length}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;