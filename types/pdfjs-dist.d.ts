declare module 'pdfjs-dist' {
  export interface PDFDocumentProxy {
    numPages: number
    getPage(pageNumber: number): Promise<PDFPageProxy>
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>
  }

  export interface TextContent {
    items: TextItem[]
  }

  export interface TextItem {
    str: string
  }

  export interface GlobalWorkerOptions {
    workerSrc: string
  }

  export function getDocument(src: { data: ArrayBuffer }): {
    promise: Promise<PDFDocumentProxy>
  }

  export const version: string
  export const GlobalWorkerOptions: GlobalWorkerOptions
}

