export interface User {
  _id: string
  name: string
  email: string
}

export interface Project {
  _id: string
  name: string
  description: string
  members: User[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  _id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  assignedTo?: User
  projectId: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}
