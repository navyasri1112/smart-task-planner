import { useState } from 'react';
import { CoverPage } from './components/CoverPage';
import { GoalForm } from './components/GoalForm';
import { TaskList } from './components/TaskList';
import { GanttChart } from './components/GanttChart';
import { StatsPanel } from './components/StatsPanel';
import { DayByDayView } from './components/DayByDayView';
import { DependencyGraph } from './components/DependencyGraph';
import { ExportModal } from './components/ExportModal';
import { generateTaskBreakdown } from './services/aiService';
import { Goal } from './types';
import { Brain, ChevronLeft, Sparkles, Download, Network, Calendar } from 'lucide-react';

function App() {
  const [showCover, setShowCover] = useState(true);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'timeline' | 'daily' | 'dependencies'>('timeline');
  const [showExport, setShowExport] = useState(false);

  const handleGoalSubmit = async (
    goalText: string,
    totalDays?: number,
    dueDate?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateTaskBreakdown({
        goal: goalText,
        totalDays,
        dueDate,
      });
      setGoal(result);
    } catch (err) {
      setError('Failed to generate task plan. Please try again.');
      console.error('Error generating plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskStatusChange = (
    taskId: string,
    status: 'pending' | 'in_progress' | 'completed'
  ) => {
    if (!goal) return;

    setGoal({
      ...goal,
      tasks: goal.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    });
  };

  const handleReset = () => {
    setGoal(null);
    setError(null);
  };

  if (showCover) {
    return <CoverPage onGetStarted={() => setShowCover(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                  Smart Task Planner
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </h1>
                <p className="text-gray-600 mt-1">
                  AI-powered project planning with timeline visualization
                </p>
              </div>
            </div>
            {goal && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-md transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                New Goal
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!goal ? (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <GoalForm onSubmit={handleGoalSubmit} isLoading={isLoading} />

            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">AI Task Breakdown</h4>
                    <p className="text-sm text-gray-600">
                      Automatically generates actionable tasks from your goals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Gantt Timeline</h4>
                    <p className="text-sm text-gray-600">
                      Visual timeline with task dependencies and durations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Smart Prioritization</h4>
                    <p className="text-sm text-gray-600">
                      Tasks categorized by priority and type for better planning
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">⏱️</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Deadline Reasoning</h4>
                    <p className="text-sm text-gray-600">
                      Fits all tasks within your time constraints intelligently
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{goal.title}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Duration:</span>
                    <span>{goal.totalDays} days</span>
                  </div>
                  {goal.dueDate && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">Due:</span>
                      <span>{new Date(goal.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Tasks:</span>
                    <span>{goal.tasks.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveView('timeline')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeView === 'timeline'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={() => setActiveView('daily')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                        activeView === 'daily'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Day-by-Day
                    </button>
                    <button
                      onClick={() => setActiveView('dependencies')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                        activeView === 'dependencies'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Network className="w-4 h-4" />
                      Dependencies
                    </button>
                  </div>

                  <button
                    onClick={() => setShowExport(true)}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md transition-all font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {activeView === 'timeline' && (
                <>
                  <GanttChart tasks={goal.tasks} totalDays={goal.totalDays} />
                  <TaskList tasks={goal.tasks} onTaskStatusChange={handleTaskStatusChange} />
                </>
              )}

              {activeView === 'daily' && (
                <DayByDayView
                  tasks={goal.tasks}
                  totalDays={goal.totalDays}
                  startDate={new Date()}
                />
              )}

              {activeView === 'dependencies' && (
                <>
                  <DependencyGraph tasks={goal.tasks} />
                  <TaskList tasks={goal.tasks} onTaskStatusChange={handleTaskStatusChange} />
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <StatsPanel goal={goal} />
              </div>
            </div>
          </div>
        )}

        {showExport && goal && (
          <ExportModal goal={goal} onClose={() => setShowExport(false)} />
        )}

        {!goal && (
          <footer className="mt-12 text-center text-sm text-gray-600">
            <p>
              Built with React, TypeScript, and Tailwind CSS • Add your OpenAI API key to enable advanced AI features
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
