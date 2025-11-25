import React, { useRef, useState, useCallback } from 'react';
import { CloudUpload, Image as ImageIcon, Plus } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        onFilesSelected(imageFiles);
      }
    }
  }, [onFilesSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        onFilesSelected(imageFiles);
      }
    }
  };

  const triggerSelect = () => {
    inputRef.current?.click();
  };

  return (
    <div className="relative group rounded-2xl p-[2px] bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 hover:from-brand-500/50 hover:via-blue-500/50 hover:to-brand-500/50 transition-all duration-500 cursor-pointer shadow-xl shadow-black/50">
      <div
        onClick={triggerSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full h-72 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden
          ${isDragOver 
            ? 'bg-slate-900/90' 
            : 'bg-slate-900/95 group-hover:bg-slate-900/80'}
        `}
      >
        {/* Background Grid inside dropzone */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', 
               backgroundSize: '24px 24px' 
             }}>
        </div>

        <input
          type="file"
          ref={inputRef}
          onChange={handleChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        
        <div className={`
          relative p-6 rounded-full mb-6 transition-all duration-300
          ${isDragOver ? 'bg-brand-500/20 scale-110' : 'bg-slate-800 group-hover:bg-slate-800/80 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-brand-500/10'}
        `}>
           <div className="absolute inset-0 rounded-full border border-white/5"></div>
          {isDragOver ? (
            <CloudUpload className="w-10 h-10 text-brand-400 animate-bounce" />
          ) : (
            <ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-brand-300 transition-colors" />
          )}
          <div className="absolute -bottom-1 -right-1 bg-brand-500 rounded-full p-1 border-4 border-slate-900">
             <Plus size={12} className="text-white" />
          </div>
        </div>

        <div className="text-center relative z-10 px-4">
          <p className="text-xl font-semibold text-slate-200 group-hover:text-white transition-colors">
            {isDragOver ? 'Drop it like it\'s hot!' : 'Click or Drag images here'}
          </p>
          <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto group-hover:text-slate-400 transition-colors">
            Supports high-res PNG, JPG, WEBP.
            <br /> <span className="text-xs opacity-75">Multiple files allowed</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
