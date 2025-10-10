import { Task } from '../types';
import { useMemo } from 'react';
import { Network, ArrowRight } from 'lucide-react';

interface DependencyGraphProps {
  tasks: Task[];
}

const categoryColors: Record<string, { bg: string; border: string }> = {
  Planning: { bg: 'bg-cyan-500', border: 'border-cyan-600' },
  Design: { bg: 'bg-pink-500', border: 'border-pink-600' },
  Development: { bg: 'bg-emerald-500', border: 'border-emerald-600' },
  Testing: { bg: 'bg-amber-500', border: 'border-amber-600' },
  Deployment: { bg: 'bg-blue-500', border: 'border-blue-600' },
};

export function DependencyGraph({ tasks }: DependencyGraphProps) {
  const { nodes, criticalPath } = useMemo(() => {
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    const calculateCriticalPath = () => {
      const visited = new Set<string>();
      const pathLengths = new Map<string, number>();

      const dfs = (taskId: string): number => {
        if (pathLengths.has(taskId)) return pathLengths.get(taskId)!;

        const task = taskMap.get(taskId);
        if (!task) return 0;

        let maxDepLength = 0;
        for (const depId of task.dependencies) {
          maxDepLength = Math.max(maxDepLength, dfs(depId));
        }

        const length = maxDepLength + task.estimatedDurationDays;
        pathLengths.set(taskId, length);
        return length;
      };

      tasks.forEach(task => dfs(task.id));

      const maxLength = Math.max(...Array.from(pathLengths.values()));
      const critical = new Set<string>();

      const findCriticalPath = (taskId: string, targetLength: number): boolean => {
        if (pathLengths.get(taskId) === targetLength) {
          critical.add(taskId);
          const task = taskMap.get(taskId);
          if (!task) return true;

          for (const depId of task.dependencies) {
            if (findCriticalPath(depId, targetLength - task.estimatedDurationDays)) {
              return true;
            }
          }
          return task.dependencies.length === 0;
        }
        return false;
      };

      tasks.forEach(task => {
        if (pathLengths.get(task.id) === maxLength) {
          findCriticalPath(task.id, maxLength);
        }
      });

      return critical;
    };

    const criticalTasks = calculateCriticalPath();

    const groupedTasks = tasks.reduce((acc, task) => {
      const level = Math.floor(task.startDay / 5);
      if (!acc[level]) acc[level] = [];
      acc[level].push(task);
      return acc;
    }, {} as Record<number, Task[]>);

    return {
      nodes: Object.entries(groupedTasks).sort(([a], [b]) => Number(a) - Number(b)),
      criticalPath: criticalTasks,
    };
  }, [tasks]);

  const getDependencyConnections = (task: Task) => {
    return task.dependencies.map(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask ? depTask.title : null;
    }).filter(Boolean);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Network className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dependency Graph</h2>
          <p className="text-sm text-gray-600">Task relationships and critical path</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-red-900">Critical Path Tasks</span>
        </div>
        <p className="text-sm text-red-800">
          {criticalPath.size} task(s) on the critical path. Delays in these tasks will affect the overall timeline.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px] space-y-6">
          {nodes.map(([level, levelTasks], levelIndex) => (
            <div key={level}>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
                  Phase {parseInt(level) + 1}
                </div>
                <div className="text-sm text-gray-500">
                  Days {parseInt(level) * 5} - {(parseInt(level) + 1) * 5}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                {levelTasks.map(task => {
                  const colors = categoryColors[task.category];
                  const isCritical = criticalPath.has(task.id);
                  const dependencies = getDependencyConnections(task);

                  return (
                    <div
                      key={task.id}
                      className={`relative group ${
                        isCritical ? 'ring-4 ring-red-300 ring-offset-2' : ''
                      }`}
                    >
                      <div
                        className={`px-4 py-3 ${colors.bg} ${colors.border} border-2 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer min-w-[200px]`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm line-clamp-2">
                            {task.title}
                          </h4>
                          {isCritical && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/90">
                          <span>{task.category}</span>
                          <span>{task.estimatedDurationDays.toFixed(1)}d</span>
                        </div>
                        {dependencies.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <div className="text-xs text-white/80 font-medium mb-1">
                              Depends on:
                            </div>
                            {dependencies.map((dep, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-xs text-white/70">
                                <ArrowRight className="w-3 h-3" />
                                <span className="truncate">{dep}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                        <div className="font-semibold mb-1">{task.title}</div>
                        <div>Priority: {task.priority}</div>
                        <div>Duration: {task.estimatedDurationDays.toFixed(1)} days</div>
                        {isCritical && <div className="text-red-400 font-bold mt-1">⚠️ Critical Path</div>}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {levelIndex < nodes.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-gray-400 to-gray-300"></div>
                    <ArrowRight className="w-5 h-5 text-gray-400 transform rotate-90" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded ring-2 ring-red-300"></div>
            <span className="text-gray-600">Critical Path Task</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Dependency Link</span>
          </div>
        </div>
      </div>
    </div>
  );
}
