import { useState, useEffect } from 'react';
import { ExternalLink, Youtube, Globe } from 'lucide-react';
import { extractYouTubeId, isYouTubeUrl, extractDomain } from '../utils/linkPreview';
import { MetadataDisplay } from './MetadataDisplay';
import type { FileMetadata } from '../types';

export interface LinkViewerProps {
  url: string;
  fileName: string;
  meta?: FileMetadata;
}

export const LinkViewer = ({ url, fileName, meta }: LinkViewerProps) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const isYouTube = isYouTubeUrl(url);

  useEffect(() => {
    if (isYouTube) {
      setVideoId(extractYouTubeId(url));
    }
  }, [url, isYouTube]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 md:p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
                {isYouTube ? (
                  <Youtube className="w-6 h-6 text-white" />
                ) : (
                  <Globe className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">{fileName}</h2>
                <p className="text-sm text-slate-400">
                  {isYouTube ? 'YouTube Video' : 'External Link'}
                </p>
              </div>
            </div>
            
            {/* Open in new tab button */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Open External</span>
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-sm mt-4">
            <span className="text-slate-500">Source:</span>
            <span className="text-purple-400 font-medium">{extractDomain(url)}</span>
          </div>
        </div>

        {/* Metadata */}
        <MetadataDisplay meta={meta} />

        {/* Content */}
        {isYouTube && videoId ? (
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={fileName}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 break-all"
              >
                {url}
              </a>
            </div>
            <div className="bg-white" style={{ height: '600px' }}>
              <iframe
                src={url}
                title={fileName}
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
