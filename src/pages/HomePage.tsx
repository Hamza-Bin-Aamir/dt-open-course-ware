import { Link } from 'react-router-dom';
import { courseStructure } from '../data/courseStructure';
import { BookOpen, FolderOpen, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-sm text-purple-300">
              <span>A free collection of educational debate resources</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
                GIKI DT's
              </span>
              <br />
              <span className="text-white">Open Courseware</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Access high-quality debate reference materials, course content, and learning resources — completely free.
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Available Courses</h2>
          <p className="text-slate-400">Explore our collection of comprehensive course materials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseStructure.courses.map(course => {
            const totalFiles = course.weeks.reduce(
              (acc, week) => acc + week.files.length,
              0
            );
            
            return (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors mb-2">
                      {course.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4" />
                        <span>{course.weeks.length} weeks</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{totalFiles} materials</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
