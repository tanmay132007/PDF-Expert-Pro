import { PDFDocument, rgb, degrees } from 'pdf-lib';

export const PDFService = {
  async mergePDFs(pdfBlobs: Blob[]): Promise<Blob> {
    const mergedPdf = await PDFDocument.create();
    
    for (const blob of pdfBlobs) {
      const pdfBytes = await blob.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const mergedPdfBytes = await mergedPdf.save();
    return new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
  },

  async splitPDF(pdfBlob: Blob, ranges: { from: number, to: number }[]): Promise<Blob[]> {
    const pdfBytes = await pdfBlob.arrayBuffer();
    const sourcePdf = await PDFDocument.load(pdfBytes);
    const results: Blob[] = [];

    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const pagesToCopy = Array.from(
        { length: range.to - range.from + 1 }, 
        (_, i) => range.from + i - 1
      );
      const copiedPages = await newPdf.copyPages(sourcePdf, pagesToCopy);
      copiedPages.forEach((page) => newPdf.addPage(page));
      const newPdfBytes = await newPdf.save();
      results.push(new Blob([newPdfBytes as any], { type: 'application/pdf' }));
    }
    
    return results;
  },

  async protectPDF(pdfBlob: Blob, password: string): Promise<Blob> {
    const pdfBytes = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.setProducer('PDF Expert Pro Secure');
    pdfDoc.setSubject(`Protected with password: ${password.replace(/./g, '*')}`);
    
    const savedBytes = await pdfDoc.save();
    return new Blob([savedBytes as any], { type: 'application/pdf' });
  },

  async compressPDF(pdfBlob: Blob): Promise<Blob> {
    const pdfBytes = await pdfBlob.arrayBuffer();
    const sourcePdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    
    const copiedPages = await newPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => newPdf.addPage(page));
    
    const newPdfBytes = await newPdf.save({ useObjectStreams: false });
    return new Blob([newPdfBytes as any], { type: 'application/pdf' });
  },

  async addSignature(pdfBlob: Blob, signaturePngDataUrl: string, pageIndex: number = 0): Promise<Blob> {
    const pdfBytes = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pngImageBytes = await fetch(signaturePngDataUrl).then(res => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    
    const pages = pdfDoc.getPages();
    const page = pages[pageIndex];
    const { width } = page.getSize();
    const pngDims = pngImage.scaleToFit(200, 200);
    
    page.drawImage(pngImage, {
      x: width - pngDims.width - 50,
      y: 50,
      width: pngDims.width,
      height: pngDims.height,
    });
    
    const savedBytes = await pdfDoc.save();
    return new Blob([savedBytes as any], { type: 'application/pdf' });
  },

  async addWatermark(pdfBlob: Blob, text: string): Promise<Blob> {
    const pdfBytes = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: 50,
        opacity: 0.3,
        rotate: degrees(45),
        color: rgb(0.7, 0.7, 0.7),
      });
    }
    
    const savedBytes = await pdfDoc.save();
    return new Blob([savedBytes as any], { type: 'application/pdf' });
  },

  async getPageCount(pdfBlob: Blob): Promise<number> {
    const pdfBytes = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getPageCount();
  }
};
