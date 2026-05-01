import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';

// Use a more stable worker source from the package itself
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface InteractiveStampProps {
  pdfFile: Blob;
  signatureImage: string;
  onComplete: (position: { x: number, y: number, page: number }) => void;
}

const InteractiveStamp: React.FC<InteractiveStampProps> = ({ pdfFile, signatureImage, onComplete }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const containerRef = useRef<HTMLDivElement>(null);

  const finalize = () => {
    // In a real app, we'd calculate the exact PDF points based on viewport vs PDF dimensions.
    // For this prototype, we'll send the position and use it in our PDFService update.
    onComplete({ ...position, page: currentPage - 1 });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F8FC' }}>
      <div style={{ padding: '16px 20px', backgroundColor: '#FFF', borderBottom: '1px solid #E2E8F0' }}>
         <div className="title-md">Position your signature</div>
         <div className="caption" style={{ color: 'var(--text-muted)' }}>Drag the box to where you want to sign.</div>
      </div>

      <div ref={containerRef} style={{ flex: 1, overflow: 'auto', position: 'relative', display: 'flex', justifyContent: 'center', padding: 20 }}>
        <div style={{ position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Document file={pdfFile} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            <Page pageNumber={currentPage} width={320} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>

          {/* Draggable Signature Overlay */}
          <motion.div
            drag
            dragConstraints={containerRef}
            onDragEnd={(_e, info) => setPosition({ x: info.point.x, y: info.point.y })}
            style={{
              position: 'absolute',
              top: 100,
              left: 100,
              width: 120,
              height: 60,
              border: '2px solid var(--primary-500)',
              backgroundColor: 'rgba(229, 57, 53, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              zIndex: 10
            }}
          >
            <img src={signatureImage} alt="Sig" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
            <div style={{ position: 'absolute', bottom: -20, backgroundColor: 'var(--primary-500)', color: '#FFF', padding: '2px 8px', borderRadius: 4, fontSize: 10 }}>Drag Me</div>
          </motion.div>
        </div>
      </div>

      <div style={{ padding: 20, backgroundColor: '#FFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 12 }}>
         <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="btn-secondary" style={{ width: 44, height: 44, padding: 0 }}>‹</button>
            <span className="body-md">Page {currentPage} / {numPages || '-'}</span>
            <button onClick={() => setCurrentPage(p => Math.min(numPages || 1, p + 1))} className="btn-secondary" style={{ width: 44, height: 44, padding: 0 }}>›</button>
         </div>
         <button className="btn-primary" onClick={finalize} style={{ width: 'auto', padding: '0 24px' }}>Stamp Here</button>
      </div>
    </div>
  );
};

export default InteractiveStamp;
