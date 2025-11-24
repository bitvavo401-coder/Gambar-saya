import React, { useState, useCallback } from 'react';
import { UploadedImage, AnalysisType } from './types';
import { fileToBase64, generateId } from './services/utils';
import { analyzeImageWithGemini } from './services/geminiService';
import DropZone from './components/DropZone';
import ImageCard from './components/ImageCard';
import { Camera, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newImages: UploadedImage[] = [];

    for (const file of files) {
      const base64 = await fileToBase64(file);
      newImages.push({
        id: generateId(),
        file,
        previewUrl: base64,
        status: 'idle'
      });
    }

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const handleAnalyze = useCallback(async (id: string, type: AnalysisType, prompt: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, status: 'analyzing', analysisType: type, analysisResult: undefined } : img
    ));

    const imageToAnalyze = images.find(img => img.id === id);
    if (!imageToAnalyze) return;

    try {
      // imageToAnalyze.previewUrl is a base64 Data URL
      const result = await analyzeImageWithGemini(
        imageToAnalyze.previewUrl,
        imageToAnalyze.file.type,
        prompt
      );

      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, status: 'success', analysisResult: result } : img
      ));
    } catch (error) {
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, status: 'error' } : img
      ));
    }
  }, [images]);

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500/10 p-2 rounded-lg">
              <Camera className="w-6 h-6 text-brand-400" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-brand-600">
              Visionary Uploads
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400 hidden sm:flex">
             <div className="flex items-center gap-1">
                <Zap size={14} className="text-yellow-400" />
                <span>Powered by Gemini 2.5</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Upload images. <br/>
            <span className="text-brand-400">Unlock insights.</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Drag and drop your images below to instantly generate descriptions, hashtags, or extract text using advanced AI vision.
          </p>
        </section>

        {/* Upload Section */}
        <section className="max-w-3xl mx-auto">
          <DropZone onFilesSelected={handleFilesSelected} />
        </section>

        {/* Grid Section */}
        {images.length > 0 && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-200">
                Your Gallery <span className="text-slate-500 text-sm font-normal ml-2">({images.length})</span>
              </h3>
              {images.length > 1 && (
                 <button 
                  onClick={() => setImages([])}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                 >
                   Clear All
                 </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map(image => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onRemove={handleRemoveImage}
                  onAnalyze={handleAnalyze}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Visionary Uploads. All processing happens safely in your browser session.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;