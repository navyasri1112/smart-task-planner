export type TaskCategory = 'Planning' | 'Design' | 'Development' | 'Testing' | 'Deployment';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedDurationDays: number;
  startDay: number;
  endDay: number;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  dependencies: string[];
  orderIndex: number;
}

export interface Goal {
  id: string;
  title: string;
  totalDays: number;
  dueDate?: Date;
  status: TaskStatus;
  tasks: Task[];
  createdAt: Date;
}

export interface TaskBreakdownRequest {
  goal: string;
  totalDays?: number;
  dueDate?: string;
}

export interface TaskBreakdownResponse {
  goal: Goal;
  reasoning: string;
}
