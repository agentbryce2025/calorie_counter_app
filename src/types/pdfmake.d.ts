declare module 'pdfmake/build/pdfmake' {
  interface TDocumentDefinitions {
    content: any[];
    styles?: any;
    defaultStyle?: any;
    pageSize?: string | { width: number, height: number };
    pageOrientation?: 'portrait' | 'landscape';
    pageMargins?: [number, number, number, number];
    info?: {
      title?: string;
      author?: string;
      subject?: string;
      keywords?: string;
    };
    header?: any;
    footer?: any;
  }

  interface PdfMakeStatic {
    vfs: any;
    createPdf(documentDefinition: TDocumentDefinitions): {
      download: (defaultFileName?: string) => void;
      getBase64: (callback: (data: string) => void) => void;
      getBuffer: (callback: (buffer: Uint8Array) => void) => void;
      getBlob: (callback: (blob: Blob) => void) => void;
      getDataUrl: (callback: (dataUrl: string) => void) => void;
    };
  }

  const pdfMake: PdfMakeStatic;
  export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const pdfMakeFonts: {
    pdfMake: {
      vfs: any;
    }
  };
  export default pdfMakeFonts;
}