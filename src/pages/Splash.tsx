import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    setTimeout(() => setOpacity(1), 100);
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Delay for branding
      setTimeout(() => {
        if (session) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }, 2000);
    };

    checkAuth();
  }, [navigate]);

  return (
    <div
      style={{
        backgroundColor: 'var(--secondary-500)',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        opacity,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <Logo />
      
      <h1
        className="display-lg"
        style={{
          color: '#FFFFFF',
          marginTop: '24px',
          animation: 'slideUp 0.4s ease-out 0.4s both',
        }}
      >
        PDF Expert Pro
      </h1>
      
      <p
        className="body-md"
        style={{
          color: 'var(--text-muted)',
          marginTop: '12px',
          animation: 'slideUp 0.4s ease-out 0.55s both',
        }}
      >
        Work smarter with every PDF.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginTop: '48px',
          animation: 'fadeIn 0.3s ease-out 0.7s both',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-500)',
              animation: `pulse 1s infinite ${i * 0.2}s alternate`,
            }}
          />
        ))}
      </div>

      <div
        className="caption"
        style={{
          position: 'absolute',
          bottom: '32px',
          color: 'var(--text-secondary)',
        }}
      >
        v1.0.0
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Splash;
