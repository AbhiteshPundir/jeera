import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Dashboard: React.FC = () => {
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
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value text-primary">12</div>
            <div className="stat-desc">3 completed</div>
          </CardContent>
        </Card>
        <Card className="stat bg-base-200 rounded-box shadow">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value text-secondary">4</div>
            <div className="stat-desc">1 active</div>
          </CardContent>
        </Card>
        <Card className="stat bg-base-200 rounded-box shadow">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value text-accent">7</div>
            <div className="stat-desc">2 new</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 