import { Task, TaskCategory, TaskPriority } from '../types';
import { CheckCircle2, Circle, Clock, Calendar, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
}

const categoryColors: Record<TaskCategory, string> = {
  Planning: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  Design: 'bg-pink-100 text-pink-800 border-pink-300',
  Development: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Testing: 'bg-amber-100 text-amber-800 border-amber-300',
  Deployment: 'bg-blue-100 text-blue-800 border-blue-300',
};

const priorityConfig: Record<TaskPriority, { color: string; icon: string }> = {
  High: { color: 'text-red-600', icon: '🔴' },
  Medium: { color: 'text-yellow-600', icon: '🟡' },
  Low: { color: 'text-green-600', icon: '🟢' },
};

export function TaskList({ tasks, onTaskStatusChange }: TaskListProps) {
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<TaskCategory, Task[]>);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <div className="w-5 h-5 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleStatusClick = (task: Task) => {
    const statusCycle = ['pending', 'in_progress', 'completed'] as const;
    const currentIndex = statusCycle.indexOf(task.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    onTaskStatusChange(task.id, nextStatus);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Breakdown</h2>

      <div className="space-y-6">
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
              <span className="text-sm text-gray-500">({categoryTasks.length})</span>
            </div>

            <div className="space-y-3">
              {categoryTasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    task.status === 'completed'
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleStatusClick(task)}
                      className="mt-1 hover:scale-110 transition-transform flex-shrink-0"
                      title="Click to change status"
                    >
                      {getStatusIcon(task.status)}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4
                          className={`font-semibold text-gray-900 ${
                            task.status === 'completed' ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-2 py-1 text-xs font-medium border rounded ${
                              categoryColors[task.category]
                            }`}
                          >
                            {task.category}
                          </span>
                          <span className="text-lg" title={`Priority: ${task.priority}`}>
                            {priorityConfig[task.priority].icon}
                          </span>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.estimatedDurationDays.toFixed(1)} days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(task.startDate)} - {formatDate(task.endDate)}
                          </span>
                        </div>
                        {task.dependencies.length > 0 && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{task.dependencies.length} dependencies</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {tasks.filter((t) => t.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter((t) => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
