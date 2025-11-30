import { useParams } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { courseStructure } from '../data/courseStructure';
import { loadMetadataCached } from '../utils/metadataLoader';
import { AlertCircle, Loader2 } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import type { FileMetadata } from '../types';

// Lazy load viewer components - PDFViewer is especially heavy
const PDFViewer = lazy(() => import('../components/PDFViewer').then(m => ({ default: m.PDFViewer })));
const MarkdownViewer = lazy(() => import('../components/MarkdownViewer').then(m => ({ default: m.MarkdownViewer })));
const LinkViewer = lazy(() => import('../components/LinkViewer').then(m => ({ default: m.LinkViewer })));

// Loading fallback for viewers
const ViewerLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      <p className="text-slate-400">Loading viewer...</p>
    </div>
  </div>
);

export const FileViewerPage = () => {
  const { courseId, week, fileIndex } = useParams();
  const [meta, setMeta] = useState<FileMetadata | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  const course = courseStructure.courses.find(c => c.id === courseId);
  
  const weekIndex = week ? parseInt(week) : -1;
  const fileIdx = fileIndex ? parseInt(fileIndex) : -1;
  const weekData = course?.weeks[weekIndex];
  const file = weekData?.files[fileIdx];

  // Set page title based on file name
  usePageTitle(file?.name || 'File Not Found');

  // Load metadata from .meta file
  useEffect(() => {
    const loadMeta = async () => {
      if (file) {
        setLoading(true);
        const metadata = await loadMetadataCached(file.path);
        setMeta(metadata);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    loadMeta();
  }, [file]);

  if (!course || !week || !fileIndex) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl max-w-md">
          <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Content Not Found</h2>
          <p className="text-slate-400">The requested content could not be found.</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl max-w-md">
          <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">File Not Found</h2>
          <p className="text-slate-400">The requested file could not be found.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const renderViewer = () => {
    switch (file.type) {
      case 'pdf':
        return <PDFViewer filePath={file.path} fileName={file.name} meta={meta} />;
      case 'markdown':
        return <MarkdownViewer filePath={file.path} fileName={file.name} meta={meta} />;
      case 'link':
        return <LinkViewer url={file.path} fileName={file.name} meta={meta} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
            <div className="text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl max-w-md">
              <div className="bg-yellow-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Unsupported File Type</h2>
              <p className="text-slate-400">This file type is not supported yet.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={<ViewerLoader />}>
      {renderViewer()}
    </Suspense>
  );
};
