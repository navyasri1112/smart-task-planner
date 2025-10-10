import { Goal } from '../types';
import { Download, FileText, Calendar, Table, X } from 'lucide-react';

interface ExportModalProps {
  goal: Goal;
  onClose: () => void;
}

export function ExportModal({ goal, onClose }: ExportModalProps) {
  const exportAsJSON = () => {
    const data = JSON.stringify(goal, null, 2);
    downloadFile(data, `${goal.title.replace(/\s+/g, '_')}.json`, 'application/json');
  };

  const exportAsCSV = () => {
    const headers = ['Task', 'Category', 'Priority', 'Duration (days)', 'Start Date', 'End Date', 'Status', 'Description'];
    const rows = goal.tasks.map(task => [
      task.title,
      task.category,
      task.priority,
      task.estimatedDurationDays.toFixed(1),
      task.startDate.toLocaleDateString(),
      task.endDate.toLocaleDateString(),
      task.status,
      task.description.replace(/,/g, ';')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    downloadFile(csv, `${goal.title.replace(/\s+/g, '_')}.csv`, 'text/csv');
  };

  const exportAsMarkdown = () => {
    let md = `# ${goal.title}\n\n`;
    md += `**Duration:** ${goal.totalDays} days\n`;
    md += `**Total Tasks:** ${goal.tasks.length}\n`;
    md += `**Created:** ${goal.createdAt.toLocaleDateString()}\n\n`;

    const categories = [...new Set(goal.tasks.map(t => t.category))];
    categories.forEach(category => {
      md += `## ${category}\n\n`;
      const categoryTasks = goal.tasks.filter(t => t.category === category);
      categoryTasks.forEach(task => {
        md += `### ${task.title}\n`;
        md += `- **Priority:** ${task.priority}\n`;
        md += `- **Duration:** ${task.estimatedDurationDays.toFixed(1)} days\n`;
        md += `- **Timeline:** ${task.startDate.toLocaleDateString()} - ${task.endDate.toLocaleDateString()}\n`;
        md += `- **Status:** ${task.status}\n`;
        if (task.description) {
          md += `- **Description:** ${task.description}\n`;
        }
        if (task.dependencies.length > 0) {
          md += `- **Dependencies:** ${task.dependencies.length} task(s)\n`;
        }
        md += '\n';
      });
    });

    downloadFile(md, `${goal.title.replace(/\s+/g, '_')}.md`, 'text/markdown');
  };

  const exportAsICS = () => {
    let ics = 'BEGIN:VCALENDAR\n';
    ics += 'VERSION:2.0\n';
    ics += 'PRODID:-//Smart Task Planner//EN\n';
    ics += 'CALSCALE:GREGORIAN\n';

    goal.tasks.forEach(task => {
      const startDate = formatICSDate(task.startDate);
      const endDate = formatICSDate(task.endDate);

      ics += 'BEGIN:VEVENT\n';
      ics += `UID:${task.id}@smarttaskplanner.com\n`;
      ics += `DTSTAMP:${formatICSDate(new Date())}\n`;
      ics += `DTSTART;VALUE=DATE:${startDate}\n`;
      ics += `DTEND;VALUE=DATE:${endDate}\n`;
      ics += `SUMMARY:${task.title}\n`;
      ics += `DESCRIPTION:${task.description}\\nCategory: ${task.category}\\nPriority: ${task.priority}\n`;
      ics += `CATEGORIES:${task.category}\n`;
      ics += `PRIORITY:${task.priority === 'High' ? '1' : task.priority === 'Medium' ? '5' : '9'}\n`;
      ics += 'END:VEVENT\n';
    });

    ics += 'END:VCALENDAR';
    downloadFile(ics, `${goal.title.replace(/\s+/g, '_')}.ics`, 'text/calendar');
  };

  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Export Plan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Choose a format to export your task plan
        </p>

        <div className="space-y-3">
          <button
            onClick={exportAsJSON}
            className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 rounded-xl transition-all text-left flex items-center gap-4 group"
          >
            <div className="p-3 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">JSON Format</div>
              <div className="text-sm text-gray-600">Complete data export for developers</div>
            </div>
          </button>

          <button
            onClick={exportAsCSV}
            className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 rounded-xl transition-all text-left flex items-center gap-4 group"
          >
            <div className="p-3 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
              <Table className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">CSV Format</div>
              <div className="text-sm text-gray-600">Import into Excel or Google Sheets</div>
            </div>
          </button>

          <button
            onClick={exportAsMarkdown}
            className="w-full p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 rounded-xl transition-all text-left flex items-center gap-4 group"
          >
            <div className="p-3 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Markdown Format</div>
              <div className="text-sm text-gray-600">Documentation-ready format</div>
            </div>
          </button>

          <button
            onClick={exportAsICS}
            className="w-full p-4 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-2 border-orange-200 rounded-xl transition-all text-left flex items-center gap-4 group"
          >
            <div className="p-3 bg-orange-600 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Calendar Format (.ics)</div>
              <div className="text-sm text-gray-600">Import into Google Calendar, Outlook, etc.</div>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
        >
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
