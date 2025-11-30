import { Calendar, User, Clock, Tag, BarChart3 } from 'lucide-react';
import type { FileMetadata } from '../types';

interface MetadataDisplayProps {
  meta?: FileMetadata;
}

export const MetadataDisplay = ({ meta }: MetadataDisplayProps) => {
  if (!meta) return null;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 mb-6">
      {/* Description */}
      {meta.description && (
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{meta.description}</p>
      )}
      
      {/* Metadata Grid */}
      <div className="flex flex-wrap gap-4 text-sm">
        {/* Author */}
        {meta.author && (
          <div className="flex items-center gap-2 text-slate-400">
            <User className="w-4 h-4 text-violet-400" />
            <span>{meta.author}</span>
          </div>
        )}

        {/* Date Published */}
        {meta.datePublished && (
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{new Date(meta.datePublished).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
        )}

        {/* Duration */}
        {meta.duration && (
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{meta.duration}</span>
          </div>
        )}

        {/* Difficulty */}
        {meta.difficulty && (
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className={`px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${getDifficultyColor(meta.difficulty)}`}>
              {meta.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {meta.tags && meta.tags.length > 0 && (
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Tag className="w-4 h-4 text-slate-500" />
          {meta.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-violet-500/10 text-violet-300 rounded-lg text-xs border border-violet-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
