import React, { useState } from 'react';
import { Trash2, Loader2, Sparkles, ScanText, Hash, Eye } from 'lucide-react';
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
      className="relative bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 transition-all hover:border-slate-600 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Preview Area */}
      <div className="relative h-48 bg-slate-900 w-full overflow-hidden group">
        <img 
          src={image.previewUrl} 
          alt="Upload preview" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className={`absolute top-2 right-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => onRemove(image.id)}
            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {image.status === 'analyzing' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center flex-col gap-2">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            <span className="text-xs font-medium text-brand-100 uppercase tracking-wider">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-slate-500 truncate max-w-[150px]">
            {image.file.name}
          </span>
          <span className="text-xs text-slate-500">
            {(image.file.size / 1024).toFixed(0)} KB
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {ANALYSIS_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnalyze(image.id, option.id as AnalysisType, option.prompt)}
              disabled={image.status === 'analyzing'}
              className={`
                flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all
                ${image.analysisType === option.id 
                  ? 'bg-brand-500/10 border-brand-500/50 text-brand-300' 
                  : 'bg-slate-700/50 border-transparent text-slate-400 hover:bg-slate-700 hover:text-slate-200'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              title={option.label}
            >
              {getIcon(option.iconName)}
              <span className="scale-90">{option.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Result Area */}
        {image.analysisResult && (
          <div className="mt-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AnalysisResult text={image.analysisResult} />
          </div>
        )}
        
        {image.status === 'error' && (
           <div className="mt-auto p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
             Failed to analyze. Please try again.
           </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;