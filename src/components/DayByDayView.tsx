import { Task } from '../types';
import { useMemo } from 'react';
import { Calendar, ChevronRight, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DayByDayViewProps {
  tasks: Task[];
  totalDays: number;
  startDate: Date;
}

interface DayPlan {
  dayNumber: number;
  date: Date;
  tasks: {
    task: Task;
    isStart: boolean;
    isEnd: boolean;
    isContinuing: boolean;
    progress: number;
  }[];
  milestones: string[];
  workload: number;
}

const categoryColors: Record<string, string> = {
  Planning: 'bg-cyan-50 border-cyan-300 text-cyan-900',
  Design: 'bg-pink-50 border-pink-300 text-pink-900',
  Development: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  Testing: 'bg-amber-50 border-amber-300 text-amber-900',
  Deployment: 'bg-blue-50 border-blue-300 text-blue-900',
};

export function DayByDayView({ tasks, totalDays, startDate }: DayByDayViewProps) {
  const dayPlans = useMemo(() => {
    const plans: DayPlan[] = [];

    for (let day = 0; day <= Math.ceil(totalDays); day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);

      const dayTasks: DayPlan['tasks'] = [];
      let totalWorkload = 0;
      const milestones: string[] = [];

      tasks.forEach(task => {
        const taskStartDay = Math.floor(task.startDay);
        const taskEndDay = Math.ceil(task.endDay);

        if (day >= taskStartDay && day <= taskEndDay) {
          const isStart = day === taskStartDay;
          const isEnd = day === taskEndDay;
          const isContinuing = !isStart && !isEnd;

          const taskDuration = task.endDay - task.startDay;
          const daysCompleted = day - task.startDay;
          const progress = Math.min(100, Math.max(0, (daysCompleted / taskDuration) * 100));

          dayTasks.push({
            task,
            isStart,
            isEnd,
            isContinuing,
            progress,
          });

          totalWorkload += task.priority === 'High' ? 3 : task.priority === 'Medium' ? 2 : 1;

          if (isEnd) {
            milestones.push(`Complete: ${task.title}`);
          }
          if (isStart && task.priority === 'High') {
            milestones.push(`Start: ${task.title}`);
          }
        }
      });

      plans.push({
        dayNumber: day,
        date: currentDate,
        tasks: dayTasks.sort((a, b) => {
          if (a.isStart && !b.isStart) return -1;
          if (!a.isStart && b.isStart) return 1;
          if (a.isEnd && !b.isEnd) return 1;
          if (!a.isEnd && b.isEnd) return -1;
          return 0;
        }),
        milestones,
        workload: totalWorkload,
      });
    }

    return plans;
  }, [tasks, totalDays, startDate]);

  const getWorkloadColor = (workload: number) => {
    if (workload >= 8) return 'bg-red-100 border-red-300 text-red-900';
    if (workload >= 5) return 'bg-amber-100 border-amber-300 text-amber-900';
    return 'bg-green-100 border-green-300 text-green-900';
  };

  const getWorkloadLabel = (workload: number) => {
    if (workload >= 8) return 'Heavy';
    if (workload >= 5) return 'Moderate';
    if (workload > 0) return 'Light';
    return 'Free';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Plan</h2>
          <p className="text-sm text-gray-600">Detailed daily breakdown with task timelines</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
        {dayPlans.map((plan) => (
          <div
            key={plan.dayNumber}
            className={`border-2 rounded-xl p-5 transition-all hover:shadow-md ${
              plan.tasks.length > 0 ? 'bg-gradient-to-r from-white to-blue-50/30' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {plan.dayNumber}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">DAY</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {formatDate(plan.date)}
                  </div>
                  {plan.milestones.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">{plan.milestones.length} milestone(s)</span>
                    </div>
                  )}
                </div>
              </div>

              {plan.tasks.length > 0 && (
                <div className={`px-3 py-1 rounded-lg border-2 ${getWorkloadColor(plan.workload)}`}>
                  <div className="text-xs font-semibold">{getWorkloadLabel(plan.workload)}</div>
                  <div className="text-xs opacity-75">{plan.tasks.length} task(s)</div>
                </div>
              )}
            </div>

            {plan.tasks.length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-sm italic">
                No tasks scheduled for this day
              </div>
            ) : (
              <div className="space-y-3">
                {plan.tasks.map(({ task, isStart, isEnd, isContinuing, progress }) => (
                  <div
                    key={task.id}
                    className={`border-2 rounded-lg p-4 ${categoryColors[task.category]}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {isEnd ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : isStart ? (
                          <ChevronRight className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`px-2 py-0.5 rounded font-medium ${
                                task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-gray-600">{task.category}</span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            {isStart && (
                              <div className="px-2 py-1 bg-blue-200 text-blue-900 rounded text-xs font-bold mb-1">
                                START
                              </div>
                            )}
                            {isEnd && (
                              <div className="px-2 py-1 bg-green-200 text-green-900 rounded text-xs font-bold mb-1">
                                FINISH
                              </div>
                            )}
                            {isContinuing && (
                              <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold mb-1">
                                ONGOING
                              </div>
                            )}
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {isStart ? 'Starting today' :
                               isEnd ? 'Completing today' :
                               `Day ${Math.floor(progress / (100 / task.estimatedDurationDays))} of ${Math.ceil(task.estimatedDurationDays)}`}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {plan.milestones.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-yellow-900 text-sm mb-1">
                          Key Milestones Today:
                        </div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          {plan.milestones.map((milestone, idx) => (
                            <li key={idx}>• {milestone}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-gray-600">Light workload</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-100 border-2 border-amber-300 rounded"></div>
              <span className="text-gray-600">Moderate workload</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-gray-600">Heavy workload</span>
            </div>
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Total Days:</span> {Math.ceil(totalDays)}
          </div>
        </div>
      </div>
    </div>
  );
}
