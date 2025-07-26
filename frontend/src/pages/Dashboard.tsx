import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/user/assigned');
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching user tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter((task: any) => task.status === 'done').length;

  return (
    <div className="space-y-6">
      <Card className="alert alert-info shadow-lg">
        <CardContent>
          <span>Welcome to your dashboard! Here's an overview of your tasks and projects.</span>
        </CardContent>
      </Card>
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
                <div className="stat-value">{tasks.length}</div>
                <div className="stat-desc">{completedTasks} completed</div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="stat bg-base-200 rounded-box shadow">
          <CardHeader>
            <CardTitle className='text-yellow-500'>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value">No projects</div>
            <div className="stat-desc">0 active</div>
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
    </div>
  );
};

export default Dashboard; 