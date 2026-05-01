import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const slides = [
  {
    title: 'Your PDF Powerhouse',
    body: 'Merge, split, compress, convert and annotate — everything in one beautiful app.',
    bgContent: (
      <div style={{
        width: 200, height: 240, backgroundColor: '#fff', borderRadius: 8,
        boxShadow: 'var(--shadow-level-3)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ height: 32, backgroundColor: 'var(--primary-500)' }} />
        <div style={{ padding: 16 }}>
          <div style={{ height: 8, width: '80%', backgroundColor: '#E2E8F0', marginBottom: 12, borderRadius: 4 }} />
          <div style={{ height: 8, width: '90%', backgroundColor: '#E2E8F0', marginBottom: 12, borderRadius: 4 }} />
          <div style={{ height: 8, width: '60%', backgroundColor: '#E2E8F0', marginBottom: 12, borderRadius: 4 }} />
        </div>
      </div>
    ),
    bgStyle: 'radial-gradient(circle at center, var(--accent-100) 0%, var(--surface-bg) 70%)',
    dark: false,
  },
  {
    title: '10+ Powerful Tools',
    body: 'From OCR to e-signatures, every PDF task is just one tap away.',
    bgContent: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, transform: 'perspective(400px) rotateX(20deg)' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ width: 72, height: 72, backgroundColor: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-level-2)' }} />
        ))}
      </div>
    ),
    bgStyle: 'radial-gradient(circle at center, var(--accent-100) 0%, var(--surface-bg) 70%)',
    dark: false,
  },
  {
    title: 'Everything in the Cloud',
    body: 'Files sync instantly across all your devices. Always backed up, always accessible.',
    bgContent: (
      <div style={{ width: 130, height: 100, backgroundColor: '#3182CE', borderRadius: 50, opacity: 0.8, filter: 'blur(20px)' }} />
    ),
    bgStyle: 'radial-gradient(circle at center, #EBF8FF 0%, var(--surface-bg) 70%)',
    dark: false,
  },
  {
    title: 'Ready to Transform Your PDFs?',
    body: 'Join thousands of users working smarter every day.',
    bgContent: (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(circle, rgba(229,57,53,0.25) 0%, transparent 70%)' }} />
        <Logo size={100} />
      </div>
    ),
    bgStyle: '#1A1A2E',
    dark: true,
  }
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  };

  const handleSkip = () => {
    navigate('/auth/signin');
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: slide.dark ? '#1A1A2E' : 'var(--surface-bg)', transition: 'background-color 0.3s' }}>
      
      {/* Header / Skip */}
      <div style={{ height: '56px', display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 0 0', position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
        {currentSlide < slides.length - 1 && (
          <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontSize: 14, fontWeight: 500, fontFamily: 'Inter', cursor: 'pointer' }}>
            Skip
          </button>
        )}
      </div>

      {/* Illustration Area */}
      <div style={{ flex: 0.55, background: slide.bgStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
        {slide.bgContent}
      </div>

      {/* Text Area */}
      <div style={{ flex: 0.45, padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '24px' }}>
        <h2 className="display-lg" style={{ color: slide.dark ? '#FFFFFF' : 'var(--text-primary)', marginBottom: '12px', fontSize: '28px' }}>
          {slide.title}
        </h2>
        <p className="body-lg" style={{ color: slide.dark ? '#CBD5E0' : 'var(--text-secondary)' }}>
          {slide.body}
        </p>

        <div style={{ flex: 1 }} />

        {/* Bottom Area */}
        <div style={{ width: '100%', paddingBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {currentSlide === slides.length - 1 ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn-primary" onClick={() => navigate('/auth/signup')}>Create Free Account</button>
              <button className="btn-secondary" style={{ borderColor: '#E2E8F0', color: '#E2E8F0' }} onClick={() => navigate('/auth/signin')}>I Already Have an Account</button>
              <span className="caption" style={{ color: '#718096', marginTop: '12px' }}>No credit card required · Free forever plan</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {slides.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '8px',
                    width: currentSlide === i ? '24px' : '8px',
                    borderRadius: '4px',
                    backgroundColor: currentSlide === i ? 'var(--primary-500)' : '#CBD5E0',
                    transition: 'all 0.3s spring',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {currentSlide < slides.length - 1 && (
        <div 
          onClick={handleNext} 
          style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%', zIndex: 1, cursor: 'pointer' }}
        />
      )}
    </div>
  );
};

export default Onboarding;
