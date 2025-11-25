import React, { useState, useCallback } from 'react';
import { UploadedImage, AnalysisType } from './types';
import { fileToBase64, generateId } from './services/utils';
import { analyzeImageWithGemini } from './services/geminiService';
import DropZone from './components/DropZone';
import ImageCard from './components/ImageCard';
import { Camera, Zap, Sparkles, ImagePlus } from 'lucide-react';

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
    <div className="min-h-screen text-slate-100 selection:bg-brand-500/30">
      
      {/* Glass Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10 supports-[backdrop-filter]:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-400 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative bg-slate-950 p-2 rounded-lg">
                <Camera className="w-5 h-5 text-brand-300" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Visionary<span className="text-brand-400">.ai</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400 hidden sm:flex bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
             <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <span>Powered by Gemini 2.5</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto relative">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-4">
              <Sparkles size={12} />
              <span>Next Generation Image Analysis</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Give your images <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-blue-500">
                a voice.
              </span>
            </h2>
            
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Upload images to instantly extract text, generate hashtags, or get detailed descriptions using advanced AI vision.
            </p>
          </div>
        </section>

        {/* Upload Section */}
        <section className="max-w-4xl mx-auto transform transition-all hover:scale-[1.01] duration-500">
          <DropZone onFilesSelected={handleFilesSelected} />
        </section>

        {/* Gallery Section */}
        {images.length > 0 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ImagePlus className="text-brand-400" size={20} />
                <h3 className="text-xl font-semibold text-white">
                  Gallery <span className="text-slate-500 text-base font-normal ml-2">({images.length})</span>
                </h3>
              </div>
              {images.length > 1 && (
                 <button 
                  onClick={() => setImages([])}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                 >
                   Clear Gallery
                 </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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

      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Visionary Uploads. 
            <span className="block mt-1 text-slate-600">Built for the future of web.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
