import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4 text-white">Loading project...</div>;
  if (!project) return <div className="p-4 text-red-400">Project not found.</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-400 mb-4">{project.description}</p>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Members</h2>
        <ul className="list-disc list-inside text-sm text-gray-300">
          {project.members.map(member => (
            <li key={member._id}>
              {member.name} ({member.email})
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 text-sm text-gray-500 italic">More sections coming soon: Tasks, Settings...</div>
    </div>
  );
};

export default ProjectDetails;