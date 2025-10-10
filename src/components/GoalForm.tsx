import { useState } from 'react';
import { Calendar, Target, Clock } from 'lucide-react';

interface GoalFormProps {
  onSubmit: (goal: string, totalDays?: number, dueDate?: string) => void;
  isLoading: boolean;
}

export function GoalForm({ onSubmit, isLoading }: GoalFormProps) {
  const [goal, setGoal] = useState('');
  const [totalDays, setTotalDays] = useState('14');
  const [dueDate, setDueDate] = useState('');
  const [useDeadline, setUseDeadline] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    onSubmit(
      goal,
      useDeadline ? undefined : parseInt(totalDays) || 14,
      useDeadline && dueDate ? dueDate : undefined
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Target className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Plan Your Goal</h2>
      </div>

      <div>
        <label htmlFor="goal" className="block text-sm font-semibold text-gray-700 mb-2">
          What do you want to achieve?
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="E.g., Launch a product in 2 weeks, Build a mobile app, Complete a marketing campaign..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          rows={4}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <button
          type="button"
          onClick={() => setUseDeadline(false)}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            !useDeadline
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Duration
          </div>
        </button>
        <button
          type="button"
          onClick={() => setUseDeadline(true)}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            useDeadline
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Due Date
          </div>
        </button>
      </div>

      {!useDeadline ? (
        <div>
          <label htmlFor="totalDays" className="block text-sm font-semibold text-gray-700 mb-2">
            Total Days Available
          </label>
          <input
            type="number"
            id="totalDays"
            value={totalDays}
            onChange={(e) => setTotalDays(e.target.value)}
            min="1"
            max="365"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>
      ) : (
        <div>
          <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
            Target Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !goal.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating Plan...
          </span>
        ) : (
          'Generate Task Plan'
        )}
      </button>
    </form>
  );
}
