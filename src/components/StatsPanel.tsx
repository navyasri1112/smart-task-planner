import { Goal } from '../types';
import { BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';

interface StatsPanelProps {
  goal: Goal;
}

export function StatsPanel({ goal }: StatsPanelProps) {
  const stats = useMemo(() => {
    const totalTasks = goal.tasks.length;
    const completedTasks = goal.tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = goal.tasks.filter((t) => t.status === 'in_progress').length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const tasksByPriority = {
      High: goal.tasks.filter((t) => t.priority === 'High').length,
      Medium: goal.tasks.filter((t) => t.priority === 'Medium').length,
      Low: goal.tasks.filter((t) => t.priority === 'Low').length,
    };

    const tasksByCategory = goal.tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgDuration =
      goal.tasks.reduce((sum, task) => sum + task.estimatedDurationDays, 0) / totalTasks;

    const criticalPath = Math.max(...goal.tasks.map((t) => t.endDay), 0);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      progress,
      tasksByPriority,
      tasksByCategory,
      avgDuration,
      criticalPath,
    };
  }, [goal]);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/20 rounded-lg">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">Project Overview</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-bold">{stats.progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs opacity-90">
            <span>{stats.completedTasks} completed</span>
            <span>{stats.totalTasks - stats.completedTasks} remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium opacity-90">Total Duration</span>
            </div>
            <div className="text-2xl font-bold">{goal.totalDays}</div>
            <div className="text-xs opacity-75">days</div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium opacity-90">Critical Path</span>
            </div>
            <div className="text-2xl font-bold">{stats.criticalPath.toFixed(1)}</div>
            <div className="text-xs opacity-75">days</div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium opacity-90">Avg Duration</span>
            </div>
            <div className="text-2xl font-bold">{stats.avgDuration.toFixed(1)}</div>
            <div className="text-xs opacity-75">days per task</div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs font-medium opacity-90">In Progress</span>
            </div>
            <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
            <div className="text-xs opacity-75">active tasks</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Priority Distribution</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>🔴</span>
                <span>High Priority</span>
              </div>
              <span className="font-bold">{stats.tasksByPriority.High}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>🟡</span>
                <span>Medium Priority</span>
              </div>
              <span className="font-bold">{stats.tasksByPriority.Medium}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>🟢</span>
                <span>Low Priority</span>
              </div>
              <span className="font-bold">{stats.tasksByPriority.Low}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Tasks by Category</h3>
          <div className="space-y-2">
            {Object.entries(stats.tasksByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span>{category}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
