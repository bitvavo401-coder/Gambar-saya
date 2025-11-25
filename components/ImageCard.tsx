import React, { useState } from 'react';
import { Trash2, Loader2, Sparkles, ScanText, Hash, Eye, Maximize2 } from 'lucide-react';
import { UploadedImage, ANALYSIS_OPTIONS, AnalysisType } from '../types';
import AnalysisResult from './AnalysisResult';

interface ImageCardProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
  onAnalyze: (id: string, type: AnalysisType, prompt: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove, onAnalyze }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye': return <Eye size={16} />;
      case 'Hash': return <Hash size={16} />;
      case 'FileText': return <ScanText size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div 
      className="group relative bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Preview Area */}
      <div className="relative h-56 bg-slate-950 w-full overflow-hidden">
        <img 
          src={image.previewUrl} 
          alt="Upload preview" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1 opacity-90 group-hover:opacity-100"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>

        {/* Floating Actions */}
        <div className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <button 
            onClick={() => onRemove(image.id)}
            className="p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md border border-white/10 transition-colors"
            title="Remove image"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Status Overlay */}
        {image.status === 'analyzing' && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center flex-col gap-3 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 animate-pulse"></div>
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin relative z-10" />
            </div>
            <span className="text-sm font-medium text-brand-100 animate-pulse">Analyzing with Gemini...</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-sm font-medium text-slate-200 truncate max-w-[180px]" title={image.file.name}>
                {image.file.name}
             </span>
             <span className="text-xs text-slate-500 mt-0.5">
                {(image.file.size / 1024).toFixed(0)} KB • {image.file.type.split('/')[1].toUpperCase()}
             </span>
          </div>
        </div>

        {/* Action Buttons - Pilled Style */}
        <div className="flex flex-wrap gap-2">
          {ANALYSIS_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnalyze(image.id, option.id as AnalysisType, option.prompt)}
              disabled={image.status === 'analyzing'}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center border
                ${image.analysisType === option.id 
                  ? 'bg-brand-500/10 border-brand-500/40 text-brand-300 shadow-[0_0_10px_rgba(45,212,191,0.1)]' 
                  : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-white/10'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              title={option.label}
            >
              {getIcon(option.iconName)}
              <span>{option.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Result Area */}
        {image.analysisResult && (
          <div className="mt-auto pt-4 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
               <Sparkles size={12} />
               <span>Insight</span>
            </div>
            <AnalysisResult text={image.analysisResult} />
          </div>
        )}
        
        {image.status === 'error' && (
           <div className="mt-auto p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
             Failed to analyze. Please try again.
           </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
