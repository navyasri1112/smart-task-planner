import { Task } from '../types';
import { useMemo } from 'react';

interface GanttChartProps {
  tasks: Task[];
  totalDays: number;
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  Planning: { bg: 'bg-cyan-500', border: 'border-cyan-600', text: 'text-cyan-900' },
  Design: { bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-pink-900' },
  Development: { bg: 'bg-emerald-500', border: 'border-emerald-600', text: 'text-emerald-900' },
  Testing: { bg: 'bg-amber-500', border: 'border-amber-600', text: 'text-amber-900' },
  Deployment: { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-blue-900' },
};

const priorityIndicators: Record<string, string> = {
  High: '🔴',
  Medium: '🟡',
  Low: '🟢',
};

export function GanttChart({ tasks, totalDays }: GanttChartProps) {
  const timelineMarkers = useMemo(() => {
    const markers = [];
    const step = totalDays <= 7 ? 1 : totalDays <= 14 ? 2 : totalDays <= 30 ? 5 : 10;
    for (let i = 0; i <= totalDays; i += step) {
      markers.push(i);
    }
    if (markers[markers.length - 1] !== totalDays) {
      markers.push(totalDays);
    }
    return markers;
  }, [totalDays]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.startDay - b.startDay);
  }, [tasks]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Timeline View</h2>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <div className="w-64 flex-shrink-0 font-semibold text-gray-700">Task</div>
            <div className="flex-1 relative">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                {timelineMarkers.map((day) => (
                  <div key={day} className="text-center" style={{ width: `${100 / timelineMarkers.length}%` }}>
                    Day {day}
                  </div>
                ))}
              </div>
              <div className="absolute top-8 left-0 right-0 h-px bg-gray-200" />
            </div>
          </div>

          <div className="space-y-3">
            {sortedTasks.map((task) => {
              const leftPercent = (task.startDay / totalDays) * 100;
              const widthPercent = ((task.endDay - task.startDay) / totalDays) * 100;
              const colors = categoryColors[task.category];

              return (
                <div key={task.id} className="flex items-center group">
                  <div className="w-64 flex-shrink-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{priorityIndicators[task.priority]}</span>
                      <div>
                        <div className="font-medium text-gray-900 text-sm line-clamp-1">
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500">{task.category}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 relative py-2">
                    <div className="absolute inset-0 bg-gray-50 rounded" />
                    <div
                      className={`absolute h-8 ${colors.bg} ${colors.border} border-2 rounded-lg shadow-md group-hover:shadow-lg transition-all cursor-pointer`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <div className="px-2 py-1 text-xs font-semibold text-white truncate">
                        {task.estimatedDurationDays.toFixed(1)}d
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Total Duration:</span> {totalDays} days
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Tasks:</span> {tasks.length}
          </div>
          <div className="flex gap-3 ml-auto">
            {Object.entries(categoryColors).map(([category, colors]) => (
              <div key={category} className="flex items-center gap-1 text-xs">
                <div className={`w-3 h-3 ${colors.bg} rounded`} />
                <span className="text-gray-600">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
