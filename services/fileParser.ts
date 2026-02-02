import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Handle ESM/CJS interop for pdfjs-dist
// Extract named exports directly, falling back to default if necessary.
const pdfjsNamespace = pdfjsLib as any;
const GlobalWorkerOptions = pdfjsNamespace.GlobalWorkerOptions || pdfjsNamespace.default?.GlobalWorkerOptions;
const getDocument = pdfjsNamespace.getDocument || pdfjsNamespace.default?.getDocument;

// Configure worker for PDF.js
if (GlobalWorkerOptions) {
  // Use unpkg to serve the classic worker script which is compatible with importScripts
  GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
} else {
  console.warn("PDF.js GlobalWorkerOptions not found. PDF parsing might fail.");
}

export const parseFile = async (file: File): Promise<string> => {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    return await parsePdf(file);
  } else if (fileName.endsWith('.docx')) {
    return await parseDocx(file);
  } else if (fileName.endsWith('.txt') || file.type === 'text/plain') {
    return await parseTxt(file);
  } else {
    throw new Error("Unsupported file format. Please upload PDF, Word (.docx), or Text files.");
  }
};

const parseTxt = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const parsePdf = async (file: File): Promise<string> => {
  try {
    if (!getDocument) {
      throw new Error("PDF parser initialization failed (getDocument not found).");
    }

    const arrayBuffer = await file.arrayBuffer();
    // Use the resolved getDocument function
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // Combine items into strings
      // @ts-ignore
      const strings = content.items.map((item: any) => item.str);
      text += strings.join(' ') + '\n\n';
    }
    return text;
  } catch (error: any) {
    console.error("Error parsing PDF:", error);
    // Provide a more helpful error message if it's the worker issue
    if (error.name === 'MissingPDFException' || error.message?.includes('Setting up fake worker failed')) {
       throw new Error("PDF worker failed to load. Please try again or refresh the page.");
    }
    throw new Error("Failed to parse PDF file.");
  }
};

const parseDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to parse Word document.");
  }
};
