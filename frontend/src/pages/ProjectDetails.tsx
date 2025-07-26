import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { UserRound } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
  useDraggable
} from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  members: Member[];
}

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: Member | null;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'todo' | 'in-progress' | 'done';
}

const DroppableColumn = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-[280px] bg-muted/30 border rounded-md p-4 shadow-sm"
    >
      {children}
    </div>
  );
};

const DraggableTask = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    transition: 'transform 0.2s ease',
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="
        rounded-md 
        p-4 
        shadow 
        mb-2 
        bg-card 
        hover:bg-card/90 
        transition-all
        text-card-foreground
        border
        border-border
        cursor-grab
      "
    >
      <div className="font-semibold text-base mb-1">{task.title}</div>
      <div className="text-sm mb-2 text-muted-foreground">{task.description}</div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="outline">🗓 {new Date(task.dueDate).toLocaleDateString()}</Badge>
        <Badge variant="outline"><UserRound className="w-3 h-3 mr-1"/> {task.assignedTo?.name || 'Unassigned'}</Badge>
        <Badge
          className={task.priority === 'high' ? 'bg-red-700 text-white' : task.priority === 'medium' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'}
        >
          {task.priority}
        </Badge>
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    fetchTasks();
  }, [id]);

  const handleCreateTask = async () => {
    try {
      await api.post('/tasks', {
        ...newTask,
        projectId: project?._id,
      });
      fetchTasks();
      setIsTaskModalOpen(false);
      setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString();

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) return <p className="p-4 text-muted-foreground">Loading...</p>;
  if (!project) return <p className="p-4 text-destructive">Project not found.</p>;

  return (
    <div className="p-6 space-y-8">
      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-500">{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <h4 className="font-medium mb-2">Members</h4>
          <div className="flex gap-2 flex-wrap">
            {project.members.map((member) => (
              <Avatar key={member._id} className="w-8 h-8 border-2 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Kanban */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tasks
            <h4 className='text-sm font-extralight '>Drag and drop tasks to modify status</h4>
          </h2>
          <Button size="sm" className='bg-yellow-400' onClick={() => setIsTaskModalOpen(true)}>+ Add Task</Button>
        </div>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row gap-4 w-full overflow-x-auto">
            {(['todo', 'in-progress', 'done'] as const).map((status) => (
              <DroppableColumn key={status} id={status}>
                <h3 className="text-lg font-semibold capitalize mb-4 text-primary">
                  {status.replace('-', ' ')}
                </h3>
                {groupedTasks[status].length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No tasks in this lane.</p>
                ) : (
                  groupedTasks[status].map((task) => (
                    <DraggableTask key={task._id} task={task} />
                  ))
                )}
              </DroppableColumn>
            ))}
          </div>
        </DndContext>
      </div>

      {/* Task Creation Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div>
              <label className="text-sm font-medium">Assign To</label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {project.members.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value as 'low' | 'medium' | 'high' })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTask}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetails;