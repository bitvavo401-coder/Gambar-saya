export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'analyzing' | 'success' | 'error';
  analysisResult?: string;
  analysisType?: AnalysisType;
}

export enum AnalysisType {
  DESCRIBE = 'DESCRIBE',
  TAGS = 'TAGS',
  OCR = 'OCR'
}

export interface AnalysisConfig {
  id: string;
  label: string;
  prompt: string;
  iconName: string;
}

export const ANALYSIS_OPTIONS: AnalysisConfig[] = [
  {
    id: AnalysisType.DESCRIBE,
    label: 'Describe Image',
    prompt: 'Analyze this image and provide a detailed, yet concise description of what you see.',
    iconName: 'Eye'
  },
  {
    id: AnalysisType.TAGS,
    label: 'Generate Tags',
    prompt: 'Generate 10 relevant, trending hashtags for this image. Output them as a comma-separated list.',
    iconName: 'Hash'
  },
  {
    id: AnalysisType.OCR,
    label: 'Extract Text',
    prompt: 'Extract all visible text from this image exactly as it appears. If there is no text, say "No text detected".',
    iconName: 'FileText'
  }
];