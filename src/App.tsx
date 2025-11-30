import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { Menu, Loader2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import './App.css';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CoursePage = lazy(() => import('./pages/CoursePage').then(m => ({ default: m.CoursePage })));
const FileViewerPage = lazy(() => import('./pages/FileViewerPage').then(m => ({ default: m.FileViewerPage })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      <p className="text-slate-400">Loading...</p>
    </div>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <Router>
      <div className="flex min-h-screen bg-dark-900">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-slate-800/90 backdrop-blur-sm text-slate-300 hover:text-white hover:bg-slate-700 lg:hidden shadow-lg border border-slate-700"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <main className="flex-1 lg:ml-80 pt-16 lg:pt-0 transition-all duration-300">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
              <Route path="/course/:courseId/:week/:fileIndex" element={<FileViewerPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
