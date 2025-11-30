import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Loader2, FileText, Download } from 'lucide-react';
import { MetadataDisplay } from './MetadataDisplay';
import type { FileMetadata } from '../types';
import 'katex/dist/katex.min.css';

export interface MarkdownViewerProps {
  filePath: string;
  fileName: string;
  meta?: FileMetadata;
}

export const MarkdownViewer = ({ filePath, fileName, meta }: MarkdownViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error('Failed to load markdown file');
        }
        const text = await response.text();
        setContent(text);
        setError('');
      } catch (err) {
        setError('Failed to load markdown content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [filePath]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-slate-400">Loading markdown...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 md:p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">{fileName}</h2>
                <p className="text-sm text-slate-400">Markdown Document</p>
              </div>
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

        {/* Content */}
        <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-2xl p-8">
          <article className="prose prose-invert prose-purple max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:bg-gradient-to-r prose-h1:from-purple-400 prose-h1:to-blue-400
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:text-blue-300
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:text-purple-300
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-purple-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-xl
            prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-slate-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
            prose-ul:text-slate-300 prose-ol:text-slate-300
            prose-li:marker:text-purple-400
            prose-table:border-slate-700
            prose-th:bg-slate-800 prose-th:text-purple-300
            prose-td:border-slate-700">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};
