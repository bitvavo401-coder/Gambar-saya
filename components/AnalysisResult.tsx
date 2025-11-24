import React from 'react';
import { Copy, Check } from 'lucide-react';

interface AnalysisResultProps {
  text: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ text }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
          title="Copy text"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default AnalysisResult;