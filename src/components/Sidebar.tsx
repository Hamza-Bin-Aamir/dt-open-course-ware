import { Link, useParams, useLocation } from 'react-router-dom';
import { courseStructure } from '../data/courseStructure';
import { ChevronRight, ChevronDown, FileText, File, Link as LinkIcon, GraduationCap, X, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { courseId, week, fileIndex } = useParams();
  const location = useLocation();
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  const isFirstRender = useRef(true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Close sidebar on mobile when route changes (but not on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (window.innerWidth < 1024 && isOpen) {
      onToggle();
    }
  }, [location.pathname]);

  // Auto-expand weeks when course changes or when there's an active file
  useEffect(() => {
    if (courseId) {
      const course = courseStructure.courses.find(c => c.id === courseId);
      if (course) {
        const newExpandedWeeks: Record<string, boolean> = {};
        
        // If there's an active week from the URL, expand that one
        if (week !== undefined) {
          const weekIndex = parseInt(week);
          if (course.weeks[weekIndex]) {
            newExpandedWeeks[course.weeks[weekIndex].name] = true;
          }
        } else {
          // Otherwise, expand the first week by default
          if (course.weeks.length > 0) {
            newExpandedWeeks[course.weeks[0].name] = true;
          }
        }
        
        setExpandedWeeks(prev => ({ ...prev, ...newExpandedWeeks }));
      }
    }
  }, [courseId, week]);

  const toggleWeek = (weekName: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekName]: !prev[weekName]
    }));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="w-4 h-4 flex-shrink-0" />;
      case 'markdown':
        return <FileText className="w-4 h-4 flex-shrink-0" />;
      case 'link':
        return <LinkIcon className="w-4 h-4 flex-shrink-0" />;
      default:
        return <File className="w-4 h-4 flex-shrink-0" />;
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto scrollbar-thin z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Close button for mobile */}
        <button
          onClick={onToggle}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="sticky top-0 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-6 border-b border-purple-500/20 shadow-lg">
          <Link to="/" className="group block">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg group-hover:bg-white/20 transition-all">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Open Courseware</h2>
                <p className="text-xs text-purple-100/80">By GIKI DT</p>
              </div>
            </div>
          </Link>
        </div>
      
        <nav className="p-4">
          {courseStructure.courses.map(course => (
            <div key={course.id} className="mb-4">
              <Link 
                to={`/course/${course.id}`}
                className={`block p-3 rounded-lg font-medium transition-all ${
                  courseId === course.id 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <h3 className="text-sm">{course.name}</h3>
              </Link>
              
              {courseId === course.id && (
                <div className="mt-2 ml-2 space-y-1">
                  {course.weeks.map((weekItem, weekIndex) => (
                    <div key={weekItem.name}>
                      <button
                        className="flex items-center gap-2 w-full p-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all"
                        onClick={() => toggleWeek(weekItem.name)}
                      >
                        {expandedWeeks[weekItem.name] ? (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="font-medium">{weekItem.name}</span>
                        <span className="ml-auto text-xs bg-slate-800 px-2 py-0.5 rounded-full">
                          {weekItem.files.length}
                        </span>
                      </button>
                      
                      {expandedWeeks[weekItem.name] && (
                        <div className="ml-6 mt-1 space-y-0.5">
                          {weekItem.files.map((file, fileIdx) => (
                            <Link
                              key={fileIdx}
                              to={`/course/${course.id}/${weekIndex}/${fileIdx}`}
                              className={`flex items-center gap-2 p-2 text-sm rounded-lg transition-all ${
                                week === String(weekIndex) && fileIndex === String(fileIdx)
                                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                              }`}
                            >
                              {getFileIcon(file.type)}
                              <span className="truncate">{file.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* PWA Install Button */}
        {deferredPrompt && !isInstalled && (
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg"
            >
              <Download className="w-5 h-5" />
              Install App
            </button>
          </div>
        )}
      </div>
    </>
  );
};
