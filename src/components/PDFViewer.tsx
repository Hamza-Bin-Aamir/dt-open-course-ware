import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Download } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { MetadataDisplay } from './MetadataDisplay';
import type { FileMetadata } from '../types';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface PDFViewerProps {
  filePath: string;
  fileName: string;
  meta?: FileMetadata;
}

export const PDFViewer = ({ filePath, fileName, meta }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 md:p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{fileName}</h2>
              <p className="text-sm text-slate-400">PDF Document</p>
            </div>
            
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Metadata */}
        <MetadataDisplay meta={meta} />

        {/* PDF Content with floating controls */}
        <div className="relative bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 md:p-8 min-h-[600px]">
          {/* Floating Controls - positioned at top of PDF area */}
          <div className="sticky top-0 z-10 flex justify-center mb-4">
            <div className="flex flex-wrap items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-xl border border-slate-700">
              {/* Page Controls */}
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-slate-300 px-2 min-w-[80px] text-center">
                {pageNumber} / {numPages || '—'}
              </span>
              <button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="w-px h-6 bg-slate-600 mx-1" />
              
              {/* Zoom Controls */}
              <button
                onClick={zoomOut}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-slate-300 min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
                disabled={scale >= 2.0}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Document */}
          <div className="flex items-center justify-center overflow-auto">
            <Document
              file={filePath}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                  <p className="text-slate-400">Loading PDF...</p>
                </div>
              }
              error={
                <div className="text-center space-y-2">
                  <p className="text-red-400 font-medium">Failed to load PDF</p>
                  <p className="text-slate-500 text-sm">Please check if the file exists</p>
                </div>
              }
              className="pdf-page"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-2xl"
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};
