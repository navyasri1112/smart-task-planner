import { Brain, Sparkles, Target, TrendingUp, Zap, ArrowRight, Check, Rocket, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CoverPageProps {
  onGetStarted: () => void;
}

export function CoverPage({ onGetStarted }: CoverPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLS45LTItMi0yaC04Yy0xLjEgMC0yIC45LTIgMnY4YzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMnYtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      ></div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          );
        })}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            <div className="w-24 h-24 border border-blue-400/30 rounded-lg rotate-45 backdrop-blur-sm"></div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-blue-400/50 to-transparent animate-shooting-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              height: '200px',
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        <nav className="flex items-center justify-between mb-20 animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-2xl animate-pulse-glow">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TaskMaster AI</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
          >
            Sign In
          </button>
        </nav>

        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-8 animate-fade-in-scale">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            Powered by Advanced AI Technology
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Transform Your Goals Into
            <span className="block mt-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text animate-gradient-x">
              Actionable Plans
            </span>
          </h1>

          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Smart Task Planner uses cutting-edge AI to break down complex goals into detailed,
            day-by-day action plans with intelligent timeline optimization and priority management.
          </p>

          <div className="flex items-center justify-center gap-4 mb-20 animate-fade-in-up animation-delay-400">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 animate-pulse-subtle"
            >
              <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold text-lg border border-white/20 transition-all hover:scale-105 hover:shadow-xl"
            >
              Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="group p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 animate-fade-in-up animation-delay-600">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-6 transition-transform shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Planning</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Advanced algorithms analyze your goals and generate optimized task breakdowns with smart dependencies
              </p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 animate-fade-in-up animation-delay-800">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-6 transition-transform shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Visual Timeline</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Interactive Gantt charts and day-by-day views help you visualize progress and critical deadlines
              </p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 animate-fade-in-up animation-delay-1000">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-6 transition-transform shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Optimization</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Automatically adjusts timelines to fit your constraints while maximizing team efficiency
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-12 max-w-4xl mx-auto shadow-2xl animate-fade-in-up animation-delay-1200">
            <h2 className="text-3xl font-bold text-white mb-8">Everything You Need to Succeed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {[
                'AI-powered task breakdown and categorization',
                'Day-by-day detailed planning with workload analysis',
                'Interactive Gantt chart timeline visualization',
                'Smart priority and dependency management',
                'Real-time progress tracking and analytics',
                'Export plans to multiple formats',
                'Milestone tracking and notifications',
                'Critical path analysis and optimization'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 animate-fade-in-right" style={{ animationDelay: `${1.4 + idx * 0.1}s` }}>
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-100">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 flex items-center justify-center gap-12 text-blue-300 animate-fade-in-up animation-delay-2000">
            <div className="text-center transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2 animate-count-up">10K+</div>
              <div className="text-sm text-blue-200">Projects Planned</div>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"></div>
            <div className="text-center transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2 animate-count-up animation-delay-200">98%</div>
              <div className="text-sm text-blue-200">Success Rate</div>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"></div>
            <div className="text-center transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2 animate-count-up animation-delay-400">5K+</div>
              <div className="text-sm text-blue-200">Happy Users</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(45deg); opacity: 0.2; }
          50% { transform: translateY(-40px) rotate(90deg); opacity: 0.4; }
        }
        @keyframes shooting-star {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(800px) translateX(400px); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes count-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }
        .animate-float-slow { animation: float-slow ease-in-out infinite; }
        .animate-shooting-star { animation: shooting-star ease-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in-scale { animation: fade-in-scale 0.8s ease-out forwards; }
        .animate-fade-in-right { animation: fade-in-right 0.6s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.6s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 3s ease-in-out infinite; }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-count-up { animation: count-up 0.8s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
      `}</style>
    </div>
  );
}
