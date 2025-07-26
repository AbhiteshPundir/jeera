import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Plus, Search, MoreVertical, Edit, Trash2, Users, Calendar } from 'lucide-react';

import { useAuth } from '@/context/auth.context';
import api from '@/services/api';
import type { Project, Task, User } from '../types/index';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [projectTaskCounts, setProjectTaskCounts] = useState<Record<string, number>>({});

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

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

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/all');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTaskCounts = async (projects: Project[]) => {
    const counts: Record<string, number> = {};
    await Promise.all(projects.map(async (project) => {
      try {
        const res = await api.get(`/tasks/${project._id}`);
        counts[project._id] = res.data.length;
      } catch {
        counts[project._id] = 0;
      }
    }));
    setProjectTaskCounts(counts);
  };

  const handleCreateProject = async () => {
    try {
      await api.post('/projects', {
        name: formData.name,
        description: formData.description,
        members: Array.from(selectedUserIds),
      });
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setSelectedUserIds(new Set());
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      fetchTaskCounts(projects);
    }
  }, [projects]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userOptions = users
    .filter(u => user && u._id !== user._id)
    .map(u => ({ value: u._id, label: u.name }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage and organize your projects</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            {searchTerm ? 'No projects found for your search.' : 'No projects created yet.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-elevated transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${project._id}/edit`);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project._id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {project.members?.length ?? 0} members
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 3).map((member) => (
                    <Avatar key={member._id} className="w-8 h-8 border-2 border-background">
                      <AvatarImage src="" alt={member.name} />
                      <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members?.length > 3 && (
                    <div className="w-8 h-8 border-2 border-background rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {projectTaskCounts[project._id] ?? 0} tasks
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background border border-border p-6 rounded-md w-full max-w-md space-y-4 shadow-lg">
            <h3 className="text-xl font-semibold">Create New Project</h3>
            <Input
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border bg-background text-foreground p-2 h-24 resize-none"
            />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Select Members</label>
              <Select
                isMulti
                options={userOptions}
                value={userOptions.filter(option => selectedUserIds.has(option.value))}
                onChange={(selected) => {
                  const ids = new Set(selected.map((opt) => opt.value));
                  setSelectedUserIds(ids);
                }}
                styles={{
                  control: (base) => ({ ...base, backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }),
                  menu: (base) => ({ ...base, backgroundColor: 'hsl(var(--popover))' }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? 'hsl(var(--muted))' : 'hsl(var(--popover))',
                    color: 'hsl(var(--foreground))',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: 'hsl(var(--secondary))',
                    color: 'hsl(var(--foreground))',
                  }),
                  multiValueLabel: (base) => ({ ...base, color: 'hsl(var(--foreground))' }),
                  input: (base) => ({ ...base, color: 'hsl(var(--foreground))' }),
                }}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;