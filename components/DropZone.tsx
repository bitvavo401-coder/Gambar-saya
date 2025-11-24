import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

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
    <div
      onClick={triggerSelect}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
        ${isDragOver 
          ? 'border-brand-400 bg-brand-500/10 scale-[1.01]' 
          : 'border-slate-700 bg-slate-800/50 hover:border-brand-500/50 hover:bg-slate-800'}
      `}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      
      <div className={`
        p-4 rounded-full bg-slate-800 mb-4 transition-transform duration-300
        ${isDragOver ? 'scale-110 shadow-lg shadow-brand-500/20' : 'group-hover:scale-110'}
      `}>
        {isDragOver ? (
          <UploadCloud className="w-8 h-8 text-brand-400" />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-brand-400" />
        )}
      </div>

      <div className="text-center">
        <p className="text-lg font-medium text-slate-200">
          {isDragOver ? 'Drop images here' : 'Click or Drag images here'}
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Supports PNG, JPG, WEBP
        </p>
      </div>
    </div>
  );
};

export default DropZone;