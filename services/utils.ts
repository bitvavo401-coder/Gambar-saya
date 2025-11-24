/**
 * Converts a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Strips the data URL prefix (e.g., "data:image/jpeg;base64,") to get raw base64.
 */
export const stripBase64Prefix = (base64Str: string): string => {
  return base64Str.split(',')[1] || base64Str;
};

/**
 * Generates a unique ID.
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};