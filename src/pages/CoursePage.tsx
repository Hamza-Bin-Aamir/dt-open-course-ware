import { useParams, Link } from 'react-router-dom';
import { courseStructure } from '../data/courseStructure';
import { FileText, File, Link as LinkIcon, Calendar } from 'lucide-react';

export const CoursePage = () => {
  const { courseId } = useParams();
  const course = courseStructure.courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl">
          <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
          <p className="text-slate-400">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="w-5 h-5 text-blue-400" />;
      case 'markdown':
      case 'latex':
        return <FileText className="w-5 h-5 text-purple-400" />;
      case 'link':
        return <LinkIcon className="w-5 h-5 text-green-400" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  const getFileTypeBadge = (type: string) => {
    const styles = {
      pdf: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      markdown: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      latex: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      link: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    return styles[type as keyof typeof styles] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {course.name}
          </h1>
          <p className="text-lg text-slate-400">
            Select a week and file from the sidebar to view course materials.
          </p>
        </div>
        
        {/* Course Structure */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Course Structure</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {course.weeks.map((week, index) => (
              <div
                key={index}
                className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{week.name}</h3>
                </div>
                
                <ul className="space-y-2">
                  {week.files.map((file, fileIndex) => (
                    <Link
                      key={fileIndex}
                      to={`/course/${course.id}/${index}/${fileIndex}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer group/item"
                    >
                      {getFileIcon(file.type)}
                      <span className="flex-1 text-slate-300 text-sm group-hover/item:text-white transition-colors">{file.name}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getFileTypeBadge(file.type)}`}>
                        {file.type}
                      </span>
                    </Link>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
