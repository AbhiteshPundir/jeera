
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import api from '../services/api';
import { useAuth } from '../context/auth.context';
import type { Project, Task } from '../types/index';


const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks assigned to the logged-in user

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get('/tasks/user/assigned');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching user tasks:', err);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      if (!user) return;
      const res = await api.get('/projects');
      setProjects(res.data.filter((p: Project) => p.members.some((m) => m._id === user._id)));
    } catch (err) {
      console.error('Error fetching user projects:', err);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      Promise.all([fetchTasks(), fetchProjects()]).finally(() => setLoading(false));
    }
  }, [authLoading, user, fetchTasks, fetchProjects]);

  const completedTasks = tasks.filter((task) => task.status === 'done').length;
  const activeProjects = projects.length;

  return (
    <div className="space-y-6">
      <div className="">
        <CardContent>
          <span>Here's an overview of your tasks and projects.</span>
        </CardContent>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="stat bg-base-200 rounded-box shadow">
          <CardHeader>
            <CardTitle className='text-yellow-500'>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="stat-value text-primary">...</div>
            ) : (
              <>
                <div className="stat-value">Total: {tasks.length}</div>
                <div className="stat-desc text-green-500">{completedTasks} completed</div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="stat bg-base-200 rounded-box shadow">
          <CardHeader>
            <CardTitle className='text-yellow-500'>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="stat-value text-primary">...</div>
            ) : (
              <>
                <div className="stat-value">Total: {activeProjects}</div>
                <div className="stat-desc text-green-500">{activeProjects > 0 ? `${activeProjects} active` : 'No active projects'}</div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="stat bg-base-200 rounded-box shadow">
          <CardHeader>
            <CardTitle className='text-yellow-500'>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value">0</div>
            <div className="stat-desc">no new notifications</div>
          </CardContent>
        </Card>
      </div>
      {/* List of tasks */}
      {!loading && tasks.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className='text-yellow-400'>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {tasks.map((task) => (
                <li key={task._id} className="mb-2">
                  <span className="font-semibold">{task.title}</span> - <span className="capitalize">{task.status.replace('-', ' ')}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {/* List of projects */}
      {!loading && projects.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className='text-yellow-400'>My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {projects.map((project) => (
                <li key={project._id} className="mb-2">
                  <span className="font-semibold">{project.name}</span> - {project.description}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;